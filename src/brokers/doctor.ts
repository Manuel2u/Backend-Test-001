import { Op } from "sequelize";
import { Doctor, DoctorPatient, Patient, sequelize, User } from "../models";
import { MutationSelectDoctorArgs, MutationUpdateDoctorArgs, QueryGetAllAvailableDoctorsArgs, QueryGetAllAvailableDoctorsCountArgs, QueryGetPatientsAssignedToDoctorArgs, QueryGetPatientsAssignedToDoctorCountArgs } from "../types/generated";
import { preprocessFilter, preprocessSort, processPagination } from "../utils";
import logger from "../utils/logger";

export const updateDoctor = async (
    { doctorId, licenseNumber, specialization, bio, available }: MutationUpdateDoctorArgs["input"]) => {
    console.time("update_doctor");
    try {
        console.time("find_doctor");
        const doctor = await Doctor.findByPk(doctorId, { include: [{ model: User, as: "user" }] });
        console.timeEnd("find_doctor");

        if (!doctor) {
            throw new Error("Doctor not found.");
        }

        console.time("update_doctor_data");
        await doctor.update(
            {
                licenseNumber: licenseNumber ?? doctor.licenseNumber,
                specialization: specialization ?? doctor.specialization,
                bio: bio ?? doctor.bio,
                available: available ?? doctor.available,
            }
        );

        await doctor.save();
        console.timeEnd("update_doctor_data");

        console.timeEnd("update_doctor");
        return true;
    } catch (e) {
        logger.error(`ERROR UPDATING DOCTOR: ${e}`);
        throw new Error("An error occurred while updating the doctor profile. Please try again.");
    }
};

export const getAllAvailableDoctors = async ({ filter, sort, pagination, condition, }: QueryGetAllAvailableDoctorsArgs) => {
    try {

        const { limit, offset } = processPagination(pagination);
        const where = preprocessFilter(filter, condition, Doctor);

        console.log("WHERE", where);

        const sortObj = preprocessSort(sort);

        const doctors = await Doctor.findAll({
            where,
            limit,
            offset,
            order: sortObj,
            include: [
                {
                    model: User,
                    as: "user",
                }
            ]
        })

        return doctors

    } catch (e) {
        throw e
    }
}

export const getAllAvailableDoctorsCount = async ({ filter, condition, }: QueryGetAllAvailableDoctorsCountArgs) => {
    try {

        const where = preprocessFilter(filter, condition, Doctor);

        console.log("WHERE", where);

        const doctors = await Doctor.count({
            where,
        })

        return doctors

    } catch (e) {
        throw e
    }
}


export const selectDoctor = async (
    { patientId, doctorId }: MutationSelectDoctorArgs) => {
    console.time("select_doctor");
    try {
        console.time("find_patient");
        const patient = await Patient.findByPk(patientId);
        console.timeEnd("find_patient");

        if (!patient) {
            throw new Error("Patient not found.");
        }

        console.time("find_doctor");
        const doctor = await Doctor.findByPk(doctorId);
        console.timeEnd("find_doctor");

        if (!doctor) {
            throw new Error("Doctor not found.");
        }

        if (!doctor.available) {
            throw new Error("This doctor is not available for selection.");
        }

        console.time("check_existing_assignment");
        const existingAssignment = await DoctorPatient.findOne({
            where: { patientId }
        });
        console.timeEnd("check_existing_assignment");

        if (existingAssignment) {
            throw new Error("You have already selected a doctor. Please contact support to change your doctor.");
        }

        console.time("assign_doctor");
        await sequelize.transaction(async (transaction) => {
            await DoctorPatient.create(
                { doctorId, patientId },
                { transaction }
            );
        });
        console.timeEnd("assign_doctor");

        console.timeEnd("select_doctor");
        return true

    } catch (e) {
        logger.error(`ERROR SELECTING DOCTOR: ${e}`);
        throw new Error("An error occurred while selecting the doctor. Please try again.");
    }
};


export const getDoctorById = async ({ id }: { id: string }) => {
    try {
        const doctor = await Doctor.findOne({
            where: { id: id },
            include: [
                {
                    model: User,
                    as: "user",
                },
            ],
        });

        if (!doctor) {
            throw new Error("Doctor not found.");
        }

        return doctor;
    } catch (error) {
        console.error("Error fetching doctor:", error);
        throw new Error("Failed to retrieve doctor.");
    }
};


export const getPatientsAssignedToDoctor = async ({ doctorId, pagination }: QueryGetPatientsAssignedToDoctorArgs) => {
    try {
        const { limit, offset } = processPagination(pagination);

        const patients = await Patient.findAll({
            where: {
                id: {
                    [Op.in]: sequelize.literal(`(
                        SELECT patient_id FROM doctor_patient WHERE doctor_id = '${doctorId}'
                    )`)
                }
            },
            limit,
            offset,
            include: [
                {
                    model: User,
                    as: "user",
                }
            ]
        });

        return patients;
    } catch (error) {
        console.error("Error fetching patients assigned to doctor:", error);
        throw new Error("Failed to retrieve patients.");
    }
};


export const getPatientsAssignedToDoctorCount = async ({ doctorId }: QueryGetPatientsAssignedToDoctorCountArgs) => {
    try {
        const patients = await DoctorPatient.count({
            where: { doctorId },
        });

        return patients;
    } catch (error) {
        console.error("Error fetching patients assigned to doctor:", error);
        throw new Error("Failed to retrieve patients.");
    }
}