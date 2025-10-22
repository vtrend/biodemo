import { z } from "zod";

const bioData = z.object({
    client_id: z.string(),
    date_testing: z.string(),
    date_birthdate: z.string(),
    gender: z.number(),
    ethnicity: z.number(),
    creatine: z.number(),
    chloride: z.number(),
    fasting_glucose: z.number(),
    potassium: z.number(),
    sodium: z.number(),
    total_calcium: z.number(),
    total_protein: z.number(),
    creatine_unit: z.string(),
    chloride_unit: z.string(),
    fasting_glucose_unit: z.string(),
    potassium_unit: z.string(),
    sodium_unit: z.string(),
    total_calcium_unit: z.string(),
    total_protein_unit: z.string(),
});

export type bioDataType = z.infer<typeof bioData>;

export const schema = z.array(bioData);

export const abbr = {
    CR: "creatine",
    CL: "chloride",
    FG: "fasting_glucose",
    K: "potassium",
    NA: "sodium",
    TC: "total_calcium",
    TP: "total_protein",
}

export interface DataPoint {
    value: number;
    unit: string;
    date: string;
}

export interface RangeZone {
    min: number;
    max: number;
    color: string;
    legend: string;
    background?: boolean;
}