import OpenAI from "openai";
import { DoctorNote } from "../models";
import { decryptNote } from "./crypto";
import config from "../config";
import { getPatientById } from "../brokers/patient";

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
        const patient = await getPatientById({ id: doctorNote?.patientId })
        console.timeEnd("fetch_patient");

        if (!patient) {
            throw new Error("Patient not found.");
        }

        console.time("decrypt_note");
        const decryptedNote = await decryptNote(doctorNote.encryptedNote, patient?.userId);
        console.timeEnd("decrypt_note");

        console.log("Decrypted Note:", decryptedNote);

        console.time("llm_request");
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a medical AI assistant that **strictly** follows this format:
                    {
                        "checklist": ["Immediate task 1", "Immediate task 2"],
                        "plan": [
                            { "task": "Scheduled task 1", "schedule": "6h", "type": "interval" },
                            { "task": "Scheduled task 2", "schedule": "0 8 * * *", "type": "cron" },
                            { "task": "Scheduled task 3", "schedule": "14d", "type": "interval" }
                        ]
                    }
                    
                    **Rules:**
                    - If a task is time-based, use **cron format** (0 8 * * * for **"daily at 8 AM"**).
                    - If a task is interval-based, return a **duration string** (6h for **"every 6 hours"**).
                    - If a task is one-time, return **a duration** (14d for **"in 2 weeks"**).`
                },
                {
                    role: "user",
                    content: `Doctor's Note:\n\n"${decryptedNote}"\n\nExtract structured tasks **strictly in JSON**.`
                }
            ],
            temperature: 0.1,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });
        console.timeEnd("llm_request");
        console.log(JSON.stringify(response, null, 2));

        const output = response.choices[0].message.content;
        const parsedOutput = JSON.parse(output);

        return {
            checklist: parsedOutput.checklist || [],
            plan: parsedOutput.plan || [],
        };

    } catch (error) {
        console.log(error);
        throw new Error(`Failed to process doctor note with LLM. -- ${error}`);
    }
};