'use server'
import { cookies } from "next/headers";
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const url = process.env.NEXT_PUBLIC_API_URL as string

export const RegisterAction = async (formData: FormData) => {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const password_confirmation = formData.get('password_confirmation')
    try {
        const response = await fetch(`${url}register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password, password_confirmation })
        })
        const data = await response.json();


        (await cookies()).set('token', data.token, {
            httpOnly: true,
            secure: true,
        });

        (await cookies()).set('user', JSON.stringify(data.user), {
            httpOnly: true,
            secure: true,
        })

        return data
    } catch (error) {
        return error
    }
}

export const LoginAction = async (formData: FormData) => {
    const email = formData.get('email')
    const password = formData.get('password')
    try {
        const response = await fetch(`${url}login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        const data = await response.json();


        (await cookies()).set('token', data.token, {
            httpOnly: true,
            secure: true,
        });

        (await cookies()).set('user', JSON.stringify(data.user), {
            httpOnly: true,
            secure: true,
        })

        return data
    } catch (error) {
        return error
    }
}


export const LogoutAction = async () => {
    const cookieStore = cookies();
    (await cookieStore).delete('token');
    (await cookieStore).delete('user')
    // revalidatePath('/auth/login')
    redirect('/auth/login')
    return
}


export const DepartmentCreateAction = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const description = formData.get('description')
    const image = formData.get('image')
    const is_featured = formData.get('is_featured')
    try {
        const response = await fetch(`${url}departments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, image, is_featured })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const EditDepartmentAction = async (formData: FormData, id: number) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const description = formData.get('description')
    const image = formData.get('image')
    const is_featured = formData.get('is_featured')
    try {
        const response = await fetch(`${url}departments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, image, is_featured })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}


export const EditTickerAction = async (formData: FormData, id: number) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const url = formData.get('url')
    try {
        const response = await fetch(`https://qih.driveo.pk/api/v1/tickers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, url })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const DepartmentDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}departments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const ConsultantCreateAction = async (formData: FormData) => {

    const token = (await cookies()).get('token')?.value
    const name = formData.get('name')
    const email = formData.get('email')
    const office_extension = formData.get('office_extension')
    const photo = formData.get('photo')
    const departments = formData.get('departments')
    const password = formData.get('password')
    const education = formData.get('education')
    const work_experience = formData.get('work_experience')
    const membership = formData.get('membership')
    const residency = formData.get('residency')
    const certification = formData.get('certification')
    const diploma = formData.get('diploma')
    const award = formData.get('award')
    const extra_info = formData.get('extra_info')
    try {
        const response = await fetch(`${url}consultants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                office_extension,
                photo,
                departments,
                password,
                education,
                work_experience,
                membership,
                residency,
                certification,
                diploma,
                award,
                extra_info
            })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const ConsultantEditAction = async (formData: FormData, id: number) => {
    const token = (await cookies()).get('token')?.value
    const name = formData.get('name')
    const email = formData.get('email')
    const office_extension = formData.get('office_extension')
    const photo = formData.get('photo')
    const departments = formData.get('departments')
    const education = formData.get('education')
    const work_experience = formData.get('work_experience')
    const membership = formData.get('membership')
    const residency = formData.get('residency')
    const certification = formData.get('certification')
    const diploma = formData.get('diploma')
    const award = formData.get('award')
    const extra_info = formData.get('extra_info')
    try {
        const response = await fetch(`${url}consultants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                email,
                office_extension,
                photo,
                departments,
                education,
                work_experience,
                membership,
                residency,
                certification,
                diploma,
                award,
                extra_info
            })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const CreatePageAction = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const short_description = formData.get('short_description')
    const description = formData.get('description')
    try {
        const response = await fetch(`${url}pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, short_description, description })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const EditPageAction = async (id: number, formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const short_description = formData.get('short_description')
    const description = formData.get('description')
    try {
        const response = await fetch(`${url}pages/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, short_description, description })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const ConsultantDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}consultants/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}
export const TickersDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}tickers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}
export const AppointmentDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}appointments/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const PageDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}pages/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const SlideDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}slides/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}



export const UploadFileAction = async (formData: FormData) => {
    try {
        const token = (await cookies()).get('token')?.value
        const file = formData.get('file')
        if (!file) {
            throw new Error('No file provided')
        }
        const formDataWithFile = new FormData()
        formDataWithFile.append('file', file)
        const response = await fetch(`${url}upload/test`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formDataWithFile
        })
        const data = await response.json()
        return data
    } catch (error) {
        return error
    }
}

export const UploadPublicFileAction = async (formData: FormData) => {
    try {

        const file = formData.get('file')
        if (!file) {
            throw new Error('No file provided')
        }
        const formDataWithFile = new FormData()
        formDataWithFile.append('file', file)
        const response = await fetch(`${url}public/upload/test`, {
            method: 'POST',

            body: formDataWithFile
        })
        const data = await response.json()
        return data
    } catch (error) {
        return error
    }
}
export const MakeAppointmentAction = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const mr_no = formData.get('mr_no')
    const patient_name = formData.get('patient_name')
    const mobile_no = formData.get('mobile_no')
    const appointment_datetime = formData.get('appointment_dateTime')
    const department_id = Number(formData.get('department_id'))
    const consultant_id = Number(formData.get('consultant_id'))
    const patient_category = formData.get('patient_category') // ✅ added

    try {
        const response = await fetch(`${url}appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mr_no,
                patient_name,
                mobile_no,
                appointment_datetime,
                department_id,
                consultant_id,
                patient_category // ✅ send instead of message
            })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const MakePublicAppointmentAction = async (formData: FormData) => {
    const mr_no = formData.get('mr_no')
    const patient_name = formData.get('patient_name')
    const mobile_no = formData.get('mobile_no')
    const appointment_datetime = formData.get('appointment_dateTime')
    const department_id = Number(formData.get('department_id'))
    const consultant_id = Number(formData.get('consultant_id'))
    const patient_category = formData.get('patient_category') // ✅ added

    try {
        const response = await fetch(`${url}public/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                mr_no,
                patient_name,
                mobile_no,
                appointment_datetime,
                department_id,
                consultant_id,
                patient_category // ✅ send instead of message
            })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}

export const EditAppointmentAction = async (id: number, formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const mr_no = formData.get('mr_no')
    const patient_name = formData.get('patient_name')
    const mobile_no = formData.get('mobile_no')
    const appointment_datetime = formData.get('appointment_dateTime')
    const department_id = Number(formData.get('department_id'))
    const consultant_id = Number(formData.get('consultant_id'))
    const patient_category = formData.get('patient_category') // ✅ added

    try {
        const response = await fetch(`${url}appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                mr_no,
                patient_name,
                mobile_no,
                appointment_datetime,
                department_id,
                consultant_id,
                patient_category // ✅ send instead of message
            })
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}




export const TickersCreationAction = async (formData: FormData) => {
    try {
        const token = (await cookies()).get('token')?.value;

        if (!token) {
            throw new Error('Token is missing or invalid');
        }

        const title = formData.get('title') as string;
        const url = formData.get('url') as string;

        if (!title || !url) {
            throw new Error('Title or URL is missing');
        }

        const response = await fetch(`https://qih.driveo.pk/api/v1/tickers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, url })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { error: error || 'An unknown error occurred' };
    }
}


export const SlideCreateAction = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const description = formData.get('description')
    const image = formData.get('image')
    const slideUrl = formData.get('slideUrl')

    try {
        const response = await fetch(`${url}slides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, image, slideUrl })
        })
        const data = await response.json();
        return data

    } catch (error) {
        console.log("Error:", error)
        return error
    }
}


export const SlideEditAction = async (id: number, formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const title = formData.get('title')
    const description = formData.get('description')
    const image = formData.get('image')
    const slideUrl = formData.get('slideUrl')

    try {
        const response = await fetch(`${url}slides/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, image, slideUrl })
        })
        const data = await response.json();
        return data

    } catch (error) {
        console.log("Error:", error)
        return error
    }
}

export const CreateScheduleAction = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const user = JSON.parse((await cookies()).get('user')?.value as string)

    const examine_duration = formData.get('examine_duration')
    const scheduleDaysRaw = formData.get('schedule_days')

    const schedule_days = JSON.parse(scheduleDaysRaw as string)

    if (!user || !examine_duration || !schedule_days) {
        throw new Error('Required fields are missing')
    }

    const payload = {
        consultant_id: user.consultant_id,
        examine_duration: Number(examine_duration),
        schedule_days
    }


    try {
        const response = await fetch(`${url}schedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json();
        return data
    } catch (error) {
        console.log("Error:", error)
        return error
    }

}

export const CreateAdminScheduleAction = async (consultantId: number, formData: FormData) => {
    const token = (await cookies()).get('token')?.value

    const examine_duration = formData.get('examine_duration')
    const scheduleDaysRaw = formData.get('schedule_days')

    const schedule_days = JSON.parse(scheduleDaysRaw as string)

    if (!consultantId || !examine_duration || !schedule_days) {
        throw new Error('Required fields are missing')
    }

    const payload = {
        consultant_id: consultantId,
        examine_duration: Number(examine_duration),
        schedule_days
    }

    try {
        const response = await fetch(`${url}schedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json();
        return data
    } catch (error) {
        console.log("Error:", error)
        return error
    }

}

export const CreateCareerAction = async (formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const position = formData.get('position')
    const department_id = formData.get('department_id')
    const open_date = formData.get('open_date')
    const close_date = formData.get('close_date')
    const description = formData.get('description')

    try {
        const response = await fetch(`${url}careers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ position, department_id, open_date, close_date, description })
        })
        const data = await response.json();
        return data
    } catch (error) {
        console.log("Error:", error)
        return error

    }
}

export const EditCareerAction = async (id: number, formData: FormData) => {
    const token = (await cookies()).get('token')?.value
    const position = formData.get('position')
    const department_id = formData.get('department_id')
    const open_date = formData.get('open_date')
    const close_date = formData.get('close_date')
    const description = formData.get('description')

    try {
        const response = await fetch(`${url}careers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ position, department_id, open_date, close_date, description })
        })
        const data = await response.json();
        return data
    } catch (error) {
        console.log("Error:", error)
        return error

    }
}


export const CareerDeleteAction = async (id: number) => {
    const token = (await cookies()).get('token')?.value
    try {
        const response = await fetch(`${url}careers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}


export const ApplyToJobAction = async (formData: FormData) => {

    const name = formData.get('name')
    const email = formData.get('email')
    const phone = formData.get('phone')
    const resume = formData.get('resume')
    const address = formData.get('address')
    const city = formData.get('city')
    const career_id = Number(formData.get('career_id'))

    try {
        const response = await fetch(`${url}public/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, resume, address, city, career_id })
        })
        const data = await response.json();
        console.log("data: ", data)
        return data
    } catch (error) {
        console.log("Error:", error)
        return error

    }
}


export const JobApplicationDeleteAction = async (id: number) => {
    try {
        const response = await fetch(`${url}public/applications/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
        const data = await response.json();
        return data
    } catch (error) {
        return error
    }
}
