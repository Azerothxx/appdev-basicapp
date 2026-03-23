"use server";

import { query } from "@/lib/db";

export interface UOM {
    id: string;
    name: string;
    description: string | null;
}

export interface TestCategory {
    id: string;
    name: string;
    description: string | null;
}

export interface MedicalTest {
    id: string;
    name: string;
    description: string | null;
    iduom: string | null;
    idcategory: string | null;
    normalmin: number | null;
    normalmax: number | null;
    uom_name?: string;
    category_name?: string;
}

export async function getMedicalTests(): Promise<MedicalTest[]> {
    const { rows } = await query<MedicalTest>(`
    SELECT 
      m.id, m.name, m.description, m.iduom, m.idcategory, m.normalmin, m.normalmax,
      u.name as uom_name, 
      c.name as category_name
    FROM public.medicaltests m
    LEFT JOIN public.uom u ON m.iduom = u.id
    LEFT JOIN public.testcategories c ON m.idcategory = c.id
    ORDER BY m.id ASC
  `);
    return rows;
}

export async function addMedicalTest(
    name: string,
    description: string | null,
    iduom: string | null,
    idcategory: string | null,
    normalmin: number | null,
    normalmax: number | null,
): Promise<void> {
    await query(
        `INSERT INTO public.medicaltests (name, description, iduom, idcategory, normalmin, normalmax) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, description, iduom, idcategory, normalmin, normalmax],
    );
}

export async function updateMedicalTest(
    id: string,
    name: string,
    description: string | null,
    iduom: string | null,
    idcategory: string | null,
    normalmin: number | null,
    normalmax: number | null,
): Promise<void> {
    await query(
        `UPDATE public.medicaltests 
     SET name = $2, description = $3, iduom = $4, idcategory = $5, normalmin = $6, normalmax = $7 
     WHERE id = $1`,
        [id, name, description, iduom, idcategory, normalmin, normalmax],
    );
}

export async function deleteMedicalTest(id: string): Promise<void> {
    await query("DELETE FROM public.medicaltests WHERE id = $1", [id]);
}

export async function getTestCategories(): Promise<TestCategory[]> {
    const { rows } = await query<TestCategory>(
        "SELECT id, name, description FROM public.testcategories ORDER BY name ASC",
    );
    return rows;
}

export async function addTestCategory(
    name: string,
    description: string | null,
): Promise<void> {
    await query(
        "INSERT INTO public.testcategories (name, description) VALUES ($1, $2)",
        [name, description],
    );
}

export async function updateTestCategory(
    id: string,
    name: string,
    description: string | null,
): Promise<void> {
    await query(
        "UPDATE public.testcategories SET name = $2, description = $3 WHERE id = $1",
        [id, name, description],
    );
}

export async function deleteTestCategory(id: string): Promise<void> {
    await query("DELETE FROM public.testcategories WHERE id = $1", [id]);
}

export async function getUoms(): Promise<UOM[]> {
    const { rows } = await query<UOM>(
        "SELECT id, name, description FROM public.uom ORDER BY name ASC",
    );
    return rows;
}

export async function addUom(
    name: string,
    description: string | null,
): Promise<void> {
    await query("INSERT INTO public.uom (name, description) VALUES ($1, $2)", [
        name,
        description,
    ]);
}

export async function updateUom(
    id: string,
    name: string,
    description: string | null,
): Promise<void> {
    await query(
        "UPDATE public.uom SET name = $2, description = $3 WHERE id = $1",
        [id, name, description],
    );
}

export async function deleteUom(id: string): Promise<void> {
    await query("DELETE FROM public.uom WHERE id = $1", [id]);
}
