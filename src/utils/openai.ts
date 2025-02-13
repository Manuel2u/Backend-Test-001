
import OpenAI from "openai";
import dotenv from "dotenv";
import { DoctorNote, Patient } from "../models";
import { decryptNote } from "./crypto";
import config from "../config";

const openai = new OpenAI({
    apiKey: config.openai.api_key,
});

/**
 * Fetches, decrypts, and processes a doctor's note to extract actionable steps.
 * @param {string} doctorNoteId - The ID of the doctor's note.
 * @returns {Promise<{ checklist: string[], plan: { task: string, schedule: string }[] }>}
 */
export const processLLM = async (doctorNoteId: string): Promise<any> => {
    try {
        console.time("fetch_doctor_note");
        const doctorNote = await DoctorNote.findByPk(doctorNoteId);
        console.timeEnd("fetch_doctor_note");

        if (!doctorNote) {
            throw new Error("Doctor Note not found.");
        }

        console.time("fetch_patient");
        const patient = await Patient.findByPk(doctorNote.patientId);
        console.timeEnd("fetch_patient");

        if (!patient) {
            throw new Error("Patient not found.");
        }

        console.time("decrypt_note");
        const decryptedNote = await decryptNote(doctorNote.encryptedNote, patient.id);
        console.timeEnd("decrypt_note");

        console.log("Decrypted Note:", decryptedNote);

        console.time("llm_request");
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a medical assistant AI that extracts actionable steps from doctor notes." },
                { role: "user", content: `Extract actionable steps from this doctor's note:\n\n"${decryptedNote}"\n\nCategorize them into:\n1. Checklist: Immediate one-time tasks.\n2. Plan: Scheduled or recurring tasks.` }
            ],
            temperature: 0.2,
            max_tokens: 500,
            response_format: {
                type: "json_object",
            }
        });
        console.timeEnd("llm_request");

        const output = response.choices[0].message.content;
        const parsedOutput = JSON.parse(output);

        return {
            checklist: parsedOutput.checklist || [],
            plan: parsedOutput.plan || [],
        };

    } catch (error) {
        throw new Error("Failed to process doctor note with LLM.");
    }
};