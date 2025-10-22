import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import BiomarkerComponent from "@/features/biomarker";
import { abbr } from "@/data/schemas";

const schema = z.object({
  selected: z.enum(Object.keys(abbr)).default("CR"),
});

export const Route = createFileRoute("/biomarker")({
  validateSearch: schema,
  component: BiomarkerComponent,
});
