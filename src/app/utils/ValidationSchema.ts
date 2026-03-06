import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Email is invalid"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    password_confirmation: z
        .string()
        .min(1, "Password confirmation is required")
        .min(8, "Password confirmation must be more than 8 characters")
        .max(32, "Password confirmation must be less than 32 characters")
}).refine(data => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"]
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required"),
    password: z
        .string()
        .min(1, "Password is required")
})

export type LoginScehma = z.infer<typeof loginSchema>


export const departmentSchema = z.object({
    title: z
        .string()
        .min(1, "Department name is required"),
    description: z
        .string()
        .min(1, "Department name is required"),
    image: z
        .string()
        .min(1, "Image is required"),
    is_featured: z
        .number()
})

export type DepartmentSchema = z.infer<typeof departmentSchema>

export const consultantSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Email is invalid"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be more than 6 characters")
        .max(32, "Password must be less than 32 characters"),
    office_extension: z
        .string(),
    photo: z
        .string(),
    departments: z
        .array(z.string())
        .min(1, "Department is required"),
    education: z
        .array(z.object({
            degree: z
                .string()
                .min(1, "Degree is required"),
            institute: z
                .string()
                .min(1, "Institution is required"),
            year: z
                .any()
                .optional()
        }))
        .min(1, "Education is required"),
    work_experience: z
        .string(z.string())
        .min(1, "Experience is required"),
    membership: z
        .string(),
    residency: z
        .string(),
    diploma: z
        .string(),
    certification: z
        .string(),
    award: z
        .string(),
    extra_info: z
        .string()
})

export type ConstultantSchema = z.infer<typeof consultantSchema>

export const editConsultantSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Email is invalid"),
    office_extension: z
        .string()
        .min(1, "Office extention is required"),
    photo: z
        .string(),
    departments: z
        .array(z.string())
        .min(1, "Department is required"),
    education: z
        .array(z.object({
            degree: z
                .string()
                .min(1, "Degree is required"),
            institute: z
                .string()
                .min(1, "Institution is required"),
            year: z
                .any()
                .optional()
        }))
        .min(1, "Education is required"),
    work_experience: z
        .string(),
    membership: z
        .string(),
    residency: z
        .string(),
    diploma: z
        .string(),
    certification: z
        .string(),
    award: z
        .string(),
    extra_info: z
        .string()
})

export type EditConstultantSchema = z.infer<typeof editConsultantSchema>

export const makeAppointmentSchema = z.object({
    mr_no: z
        .string(),
    patient_name: z
        .string()
        .min(1, "Patient name is required"),
    mobile_no: z
        .string()
        .min(1, "Mobile no is required")
        .max(11, "Mobile must be 11 characters"),
    appointment_dateTime: z
        .string()
        .min(1, "Date & time is required"),
    department_id: z
        .string()
        .min(1, "Department is required"),
    consultant_id: z
        .string()
        .min(1, "Consultant is required"),

    // ✅ ONLY CHANGE DONE HERE
    message: z
        .string()
        .optional()
        .or(z.literal(''))
})

export type MakeAppointmentSchema = z.infer<typeof makeAppointmentSchema>

export const makeTickersSechema = z.object({
    title: z
        .string()
        .min(1, "Title is required"),
    url: z
        .string()
        .min(1, "url is required")
})

export type MakeTickersSchema = z.infer<typeof makeTickersSechema>


export const addNewPageSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required"),
    short_description: z
        .string()
        .min(1, "url is required"),
    description: z
        .string()
        .min(1, "url is required")
})

export type AddNewPageSchema = z.infer<typeof addNewPageSchema>


export const addNewSlideSchema = z.object({
    title: z
        .string(),
    description: z
        .string(),
    image: z
        .string()
        .min(1, "image is required"),
    slideUrl: z
        .string(),
})

export type AddNewSlideSchema = z.infer<typeof addNewSlideSchema>

export const createCareerSchema = z.object({
    position: z
        .string()
        .min(1, "Positiion is required"),
    department_id: z
        .string(),
    description: z
        .string()
        .min(1, "description is required"),
    open_date: z
        .string()
        .min(1, "open date is required"),
    close_date: z
        .string()
        .min(1, "close date is required")
})

export type CreateCareerSchema = z.infer<typeof createCareerSchema>

export const applyToJobSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required"),
    career_id: z
        .string()
        .min(1, "Career Id is required"),
    email: z
        .string()
        .min(1, "email is required"),
    phone: z
        .string()
        .min(1, "phone is required"),
    address: z
        .string()
        .min(1, "address is required"),
    city: z
        .string()
        .min(1, "city is required"),
    resume: z
        .string()
        .min(1, "resume is required")
})

export type ApplyToJobSchema = z.infer<typeof applyToJobSchema>
