import Student from "../models/Student.js";
import ExamResult from "../models/ExamResult.js";
import Exam from "../models/Exam.js";
import Course from "../models/Course.js"


export const examTakers = async (req, res) => {
    try {
        const registeredOnly = await Student.find({ examDate: null });

        const examTakers = await Student.find({ examDate: { $ne: null } });

        res.status(200).json([
            { name: "Registered Only", value: registeredOnly.length },
            { name: "Exam Takers", value: examTakers.length },
        ]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const getStrandSummary = async (req, res) => {
    try {
        const summary = await Student.aggregate([
            {
                // Normalize gender (uppercase)
                $addFields: {
                    genderNormalized: { $toUpper: "$gender" },
                },
            },
            {
                $group: {
                    _id: { strand: "$course1st", gender: "$genderNormalized" },
                    count: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: "$_id.strand",
                    counts: {
                        $push: {
                            gender: "$_id.gender",
                            count: "$count",
                        },
                    },
                    total: { $sum: "$count" },
                },
            },
            {
                $project: {
                    strand: "$_id",
                    male: {
                        $ifNull: [
                            {
                                $first: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$counts",
                                                as: "c",
                                                cond: { $eq: ["$$c.gender", "MALE"] },
                                            },
                                        },
                                        as: "x",
                                        in: "$$x.count",
                                    },
                                },
                            },
                            0,
                        ],
                    },
                    female: {
                        $ifNull: [
                            {
                                $first: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$counts",
                                                as: "c",
                                                cond: { $eq: ["$$c.gender", "FEMALE"] },
                                            },
                                        },
                                        as: "x",
                                        in: "$$x.count",
                                    },
                                },
                            },
                            0,
                        ],
                    },
                    total: 1,
                },
            },
        ]);

        // Compute grand total
        const grandTotal = summary.reduce((sum, s) => sum + s.total, 0);

        const withPercentage = summary.map((s) => ({
            strand: s.strand,
            male: s.male || 0,
            female: s.female || 0,
            total: s.total,
            percentage: grandTotal
                ? ((s.total / grandTotal) * 100).toFixed(1) + "%"
                : "0%",
        }));

        res.json(withPercentage);
    } catch (error) {
        console.error("Error fetching strand summary:", error);
        res.status(500).json({ error: "Failed to fetch strand summary" });
    }
};

export const getExamStats = async (req, res) => {
    try {
        const stats = await ExamResult.aggregate([
            {
                $lookup: {
                    from: "exams",
                    localField: "examId",
                    foreignField: "_id",
                    as: "exam",
                },
            },
            { $unwind: "$exam" },

            {
                $addFields: {
                    subjectKey: { $ifNull: ["$exam.title", "Unknown"] }, // ✅ use title as subject
                    effectivePassing: { $ifNull: ["$exam.passingScore", 20] }, // default 20
                },
            },

            {
                $group: {
                    _id: "$subjectKey",
                    highest: { $max: "$score" },
                    lowest: { $min: "$score" },
                    average: { $avg: "$score" },
                    total: { $sum: 1 },
                    passed: {
                        $sum: { $cond: [{ $gte: ["$score", "$effectivePassing"] }, 1, 0] },
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    subject: "$_id",
                    highest: 1,
                    lowest: 1,
                    average: { $round: ["$average", 1] },
                    passingRate: {
                        $cond: [
                            { $gt: ["$total", 0] },
                            { $divide: ["$passed", "$total"] },
                            0,
                        ],
                    },
                },
            },
            { $sort: { subject: 1 } },
        ]);

        res.json(stats);
    } catch (err) {
        console.error("Stats aggregation error:", err);
        res.status(500).json({
            error: "Failed to calculate stats",
            details: err.message,
        });
    }
};


export const getQuestionStats = async (req, res) => {
    try {
        const stats = await ExamResult.aggregate([
            // Expand answers so each row is one student's response to one question
            { $unwind: "$answers" },

            // Join with Exam to get subject & question text
            {
                $lookup: {
                    from: "exams",
                    localField: "examId",
                    foreignField: "_id",
                    as: "exam",
                },
            },
            { $unwind: "$exam" },

            // Match the specific question in the exam.questions array
            {
                $addFields: {
                    questionObj: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$exam.questions",
                                    as: "q",
                                    cond: { $eq: ["$$q._id", "$answers.questionId"] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },

            // Group by question
            {
                $group: {
                    _id: {
                        subject: "$exam.title",      // or "$exam.subjectId" if you add it
                        questionId: "$answers.questionId",
                        questionText: "$questionObj.questionText",
                    },
                    totalResponses: { $sum: 1 },
                    correctResponses: {
                        $sum: { $cond: ["$answers.isCorrect", 1, 0] },
                    },
                },
            },

            // Compute difficulty index
            {
                $project: {
                    _id: 0,
                    subject: "$_id.subject",
                    questionId: "$_id.questionId",
                    questionText: "$_id.questionText",
                    correctResponses: 1,
                    totalResponses: 1,
                    difficultyIndex: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$correctResponses", "$totalResponses"] },
                                    100,
                                ],
                            },
                            0,
                        ],
                    },
                },
            },
            { $sort: { subject: 1, questionId: 1 } },
        ]);

        res.json(stats);
    } catch (err) {
        console.error("Question stats aggregation error:", err);
        res.status(500).json({
            error: "Failed to calculate question stats",
            details: err.message,
        });
    }
};


export const getSchoolStats = async (req, res) => {
    try {
        const pipeline = [
            // Join the related exam to compute per-exam passing thresholds
            {
                $lookup: {
                    from: "exams",
                    localField: "examId",
                    foreignField: "_id",
                    as: "exam",
                },
            },
            { $unwind: "$exam" },

            // Join the student to get school of origin
            {
                $lookup: {
                    from: "students",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "student",
                },
            },
            { $unwind: "$student" },

            // Derive fields
            {
                $addFields: {
                    schoolKey: { $ifNull: ["$student.lastSchool", "Unknown School"] },

                    // passing threshold: prefer explicit exam.passingScore; otherwise 60% of total items
                    questionCount: { $size: "$exam.questions" },
                },
            },
            {
                $addFields: {
                    effectivePassing: {
                        $ifNull: [
                            "$exam.passingScore",
                            { $ceil: { $multiply: ["$questionCount", 0.6] } }, // 60%
                        ],
                    },
                },
            },
            // Was this particular exam attempt passed?
            {
                $addFields: {
                    passedThisExam: { $cond: [{ $gte: ["$score", "$effectivePassing"] }, 1, 0] },
                },
            },

            // Collapse to one row per student (per school): tally how many of their exams were passed
            {
                $group: {
                    _id: { studentId: "$studentId", schoolKey: "$schoolKey" },
                    examsTaken: { $sum: 1 },
                    examsPassed: { $sum: "$passedThisExam" },
                },
            },

            // Decide student-level pass/fail.
            // RULE: student passes if they passed a MAJORITY of the exams they took.
            // You can change this rule easily (see notes below).
            {
                $addFields: {
                    studentPassed: {
                        $cond: [
                            { $gt: ["$examsTaken", 0] },
                            { $cond: [{ $gte: ["$examsPassed", { $ceil: { $divide: ["$examsTaken", 2] } }] }, 1, 0] },
                            0,
                        ],
                    },
                },
            },

            // Group by school: unique examinees = number of students in this school
            {
                $group: {
                    _id: "$_id.schoolKey",
                    examinees: { $sum: 1 },                 // unique students
                    passed: { $sum: "$studentPassed" },     // students who passed by the rule above
                },
            },

            {
                $project: {
                    _id: 0,
                    school: "$_id",
                    examinees: 1,
                    passed: 1,
                    failed: { $subtract: ["$examinees", "$passed"] },
                    passingRate: {
                        $cond: [
                            { $gt: ["$examinees", 0] },
                            { $divide: ["$passed", "$examinees"] }, // 0..1 for frontend %
                            0,
                        ],
                    },
                },
            },
            { $sort: { school: 1 } },
        ];

        const stats = await ExamResult.aggregate(pipeline);
        res.json(stats);
    } catch (err) {
        console.error("School stats error:", err);
        res.status(500).json({ error: "Failed to calculate school stats", details: err.message });
    }
};



function computePlacement({ primaryCourse, secondaryCourse, score }) {
    if (primaryCourse && score >= primaryCourse.passingScore) {
        return primaryCourse.name
    }
    if (secondaryCourse && score >= secondaryCourse.passingScore) {
        return secondaryCourse.name
    }
    return "Not Qualified"
}

export async function getStudentsWithScores(req, res) {
    try {
        const { status, page = 1, limit = 100 } = req.query
        const filter = {}
        if (status) filter.status = status

        const pageNum = Math.max(parseInt(page, 10) || 1, 1)
        const pageSize = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 500)

        // find students
        const students = await Student.find(filter)
            .select("regNo name course1st course2nd totalScore status createdAt")
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * pageSize)
            .limit(pageSize)
            .lean()

        // collect all course codes to fetch once
        const codes = [
            ...new Set(
                students.flatMap((s) => [s.course1st, s.course2nd].filter(Boolean))
            ),
        ]

        const courseDocs = await Course.find({ name: { $in: codes } }).lean()
        const courseMap = Object.fromEntries(courseDocs.map((c) => [c.name, c]))

        const data = students.map((s) => {
            const primaryCourse = s.course1st ? courseMap[s.course1st] : null
            const secondaryCourse = s.course2nd ? courseMap[s.course2nd] : null
            const score = typeof s.totalScore === "number" ? s.totalScore : 0

            const finalPlacement = computePlacement({ primaryCourse, secondaryCourse, score })

            return {
                examineeId: s.regNo,
                name: s.name || "",
                primaryChoice: primaryCourse ? primaryCourse.name : null,
                secondaryChoice: secondaryCourse ? secondaryCourse.name : null,
                score,
                primaryCutoff: primaryCourse ? primaryCourse.passingScore : null,
                secondaryCutoff: secondaryCourse ? secondaryCourse.passingScore : null,
                finalPlacement,
                status: s.status,
            }
        })

        const total = await Student.countDocuments(filter)

        res.json({
            data,
            meta: {
                total,
                page: pageNum,
                limit: pageSize,
                pageCount: Math.ceil(total / pageSize),
            },
        })
    } catch (err) {
        console.error("getStudentsWithScores error:", err)
        res.status(500).json({ message: "Failed to load report", error: err.message })
    }
}

export const getPlacements = getStudentsWithScores