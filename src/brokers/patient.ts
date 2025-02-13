import { Patient, User } from "../models";
import { MutationUpdatePatientArgs } from "../types/generated";
import logger from "../utils/logger";

export const updatePatient = async (
  { patientId, dateOfBirth, bloodType, emergencyContact }: MutationUpdatePatientArgs["input"]) => {
  console.time("update_patient");

  try {
    console.time("find_patient");
    const patient = await Patient.findByPk(patientId, { include: [{ model: User, as: "user" }] });
    console.timeEnd("find_patient");

    if (!patient) {
      throw new Error("Patient not found.");
    }

    console.time("update_patient_data");
    await patient.update(
      {
        dateOfBirth: dateOfBirth ?? patient.dateOfBirth,
        bloodType: bloodType ?? patient.bloodType,
        emergencyContact: emergencyContact ?? patient.emergencyContact,
      }
    );

    await patient.save();
    console.timeEnd("update_patient_data");

    console.timeEnd("update_patient");
    return true
  } catch (e) {
    logger.error(`ERROR UPDATING PATIENT: ${e}`);
    throw new Error("An error occurred while updating the patient profile. Please try again.");
  }
};


export const getPatientById = async ({ id }: { id: string }) => {
  try {
    const patient = await Patient.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!patient) {
      throw new Error("Patient not found.");
    }

    return patient;
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw new Error("Failed to retrieve patient.");
  }
};