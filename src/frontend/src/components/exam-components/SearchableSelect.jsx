// PSGCSelect.jsx — simplified (no search)

import React, { useEffect, useMemo, useState } from "react";
import {
    Command,
    CommandEmpty,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Loader2 } from "lucide-react";

/* Small list popover without search */
function SimpleSelect({
    buttonLabel,
    value,
    disabled,
    items,
    loading,
    error,
    onSelect,
    open,
    setOpen,
    buttonClassName = "w-24",
}) {
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button type="button" variant="outline" disabled={disabled} className={`${buttonClassName} justify-between truncate`}>
                    {value || buttonLabel}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-[280px]">
                <Command shouldFilter={false}>
                    <CommandList>
                        {loading && (
                            <CommandItem disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                            </CommandItem>
                        )}
                        {!!error && !loading && (
                            <CommandItem disabled className="text-destructive">{error}</CommandItem>
                        )}
                        {!loading && !error && items.length === 0 && <CommandEmpty>No options.</CommandEmpty>}
                        {!loading && !error && items.map((it) => (
                            <CommandItem
                                key={it}
                                value={it}
                                onSelect={() => {
                                    onSelect?.(it);
                                    setOpen(false);
                                }}
                            >
                                <span className="truncate">{it}</span>
                                {value === it && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default function PSGCSelect({
    value = null,           // { region, province, municipality, brgy } | null
    onChange,               // (val|null) => void
    className,
    buttonClassName = "w-full",
    labels,                 // { region, province, municipality, brgy }
    endpoints,              // optional overrides
}) {
    // stable endpoints (no query params now)
    const API_BASE = "http://localhost:5000"; // or use process.env.NEXT_PUBLIC_API_URL

    const ep = useMemo(() => ({
        regions: () =>
            endpoints?.regions ? endpoints.regions() : `${API_BASE}/api/psgc/regions`,

        provinces: ({ region }) =>
            endpoints?.provinces
                ? endpoints.provinces({ region })
                : `${API_BASE}/api/psgc/provinces?region=${encodeURIComponent(region)}`,

        municipalities: ({ region, province }) =>
            endpoints?.municipalities
                ? endpoints.municipalities({ region, province })
                : `${API_BASE}/api/psgc/municipalities?region=${encodeURIComponent(region)}&province=${encodeURIComponent(province)}`,

        barangays: ({ region, province, municipality }) =>
            endpoints?.barangays
                ? endpoints.barangays({ region, province, municipality })
                : `${API_BASE}/api/psgc/barangays?region=${encodeURIComponent(region)}&province=${encodeURIComponent(province)}&municipality=${encodeURIComponent(municipality)}`,
    }), [endpoints]);
    const [region, setRegion] = useState(value?.region ?? null);
    const [province, setProvince] = useState(value?.province ?? null);
    const [municipality, setMunicipality] = useState(value?.municipality ?? null);
    const [brgy, setBrgy] = useState(value?.brgy ?? null);

    const [openR, setOpenR] = useState(false);
    const [openP, setOpenP] = useState(false);
    const [openM, setOpenM] = useState(false);
    const [openB, setOpenB] = useState(false);

    const [loadR, setLoadR] = useState(false);
    const [loadP, setLoadP] = useState(false);
    const [loadM, setLoadM] = useState(false);
    const [loadB, setLoadB] = useState(false);

    const [errR, setErrR] = useState("");
    const [errP, setErrP] = useState("");
    const [errM, setErrM] = useState("");
    const [errB, setErrB] = useState("");

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const labelText = useMemo(
        () => ({
            region: (labels && labels.region) || "Region",
            province: (labels && labels.province) || "Province",
            municipality: (labels && labels.municipality) || "Municipality/City",
            brgy: (labels && labels.brgy) || "Barangay",
        }),
        [labels]
    );

    const fetchJson = async (url, { setLoading, setError }) => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        } catch (e) {
            setError("Failed to load", e);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // load all regions on mount
    useEffect(() => {
        (async () => {
            const data = await fetchJson(ep.regions(), { setLoading: setLoadR, setError: setErrR });
            setRegions(data);
        })();
    }, [ep]);

    // load provinces when region set
    useEffect(() => {
        if (!region) { setProvinces([]); setErrP(""); return; }
        (async () => {
            const data = await fetchJson(ep.provinces({ region }), { setLoading: setLoadP, setError: setErrP });
            setProvinces(data);
        })();
    }, [region, ep]);

    // load municipalities when province set
    useEffect(() => {
        if (!region || !province) { setMunicipalities([]); setErrM(""); return; }
        (async () => {
            const data = await fetchJson(ep.municipalities({ region, province }), { setLoading: setLoadM, setError: setErrM });
            setMunicipalities(data);
        })();
    }, [region, province, ep]);

    // load barangays when municipality set
    useEffect(() => {
        if (!region || !province || !municipality) { setBarangays([]); setErrB(""); return; }
        (async () => {
            const data = await fetchJson(ep.barangays({ region, province, municipality }), { setLoading: setLoadB, setError: setErrB });
            setBarangays(data);
        })();
    }, [region, province, municipality, ep]);

    // emit only when complete
    useEffect(() => {
        const out = (region && province && municipality && brgy)
            ? { region, province, municipality, brgy }
            : null;
        onChange && onChange(out);
    }, [region, province, municipality, brgy]); // eslint-disable-line

    // cascade resets
    const selectRegion = (r) => { setRegion(r); setProvince(null); setMunicipality(null); setBrgy(null); };
    const selectProvince = (p) => { setProvince(p); setMunicipality(null); setBrgy(null); };
    const selectMunicipality = (m) => { setMunicipality(m); setBrgy(null); };
    const selectBarangay = (b) => setBrgy(b);

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-2 ${className || ""}`}>
            {/* REGION */}
            <div className="flex flex-col gap-1">
                {/* <span className="text-xs text-muted-foreground">{labelText.region}</span> */}
                <SimpleSelect
                    buttonLabel="Select region"
                    value={region}
                    disabled={false}
                    items={regions}
                    loading={loadR}
                    error={errR}
                    onSelect={selectRegion}
                    open={openR}
                    setOpen={setOpenR}
                    buttonClassName={buttonClassName}
                />
            </div>

            {/* PROVINCE */}
            <div className="flex flex-col gap-1">
                {/* <span className="text-xs text-muted-foreground">{labelText.province}</span> */}
                <SimpleSelect
                    buttonLabel="Select province"
                    value={province}
                    disabled={!region}
                    items={provinces}
                    loading={loadP}
                    error={errP}
                    onSelect={selectProvince}
                    open={openP}
                    setOpen={setOpenP}
                    buttonClassName={buttonClassName}
                />
            </div>

            {/* MUNICIPALITY/CITY */}
            <div className="flex flex-col gap-1">
                {/* <span className="text-xs text-muted-foreground">{labelText.municipality}</span> */}
                <SimpleSelect
                    buttonLabel="Select municipality"
                    value={municipality}
                    disabled={!province}
                    items={municipalities}
                    loading={loadM}
                    error={errM}
                    onSelect={selectMunicipality}
                    open={openM}
                    setOpen={setOpenM}
                    buttonClassName={buttonClassName}
                />
            </div>

            {/* BARANGAY */}
            <div className="flex flex-col gap-1">
                {/* <span className="text-xs text-muted-foreground">{labelText.brgy}</span> */}
                <SimpleSelect
                    buttonLabel="Select barangay"
                    value={brgy}
                    disabled={!municipality}
                    items={barangays}
                    loading={loadB}
                    error={errB}
                    onSelect={selectBarangay}
                    open={openB}
                    setOpen={setOpenB}
                    buttonClassName={buttonClassName}
                />
            </div>
        </div>
    );
}

/* Usage
<PSGCSelect
  onChange={(loc) => console.log("PSGC:", loc)}
/>
*/
