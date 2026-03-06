'use client'
import {
  DepartmentCreateAction,
  UploadFileAction,
} from '@/app/_actions/_actions'
import {
  DepartmentSchema,
  departmentSchema,
} from '@/app/utils/ValidationSchema'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import 'react-quill-new/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

const CreateDepartment = () => {
  const [myForm, setMyForm] = useState<DepartmentSchema>({
    title: '',
    description: '',
    image: '',
    is_featured: 0,
  })

  const [errors, setErrors] = useState<{
    [key in keyof DepartmentSchema]?: string
  }>({})

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const filePath = files[0]
    const formData = new FormData()
    formData.append('file', filePath)
    const res = await UploadFileAction(formData)
    if (res.status === 'success') {
      toast.success(res.message)
      setMyForm({ ...myForm, image: res.data.file_path })
    } else {
      toast.error(res.message)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setMyForm({
      ...myForm,
      [name]: value,
    })
    if (errors[name as keyof DepartmentSchema]) {
      setErrors({ ...errors, [name]: undefined })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = departmentSchema.safeParse(myForm)
    if (result.success) {
      const formData = new FormData()
      formData.append('title', result.data.title)
      formData.append('description', result.data.description)
      formData.append('image', result.data.image)
      formData.append('is_featured', result.data.is_featured.toString())
      const res = await DepartmentCreateAction(formData)
      if (res.status === 'success') {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    } else {
      const fieldErrors: { [key in keyof DepartmentSchema]?: string } = {}
      result.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof DepartmentSchema
        fieldErrors[fieldName] = error.message
      })
      setErrors(fieldErrors)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link', 'image', 'video'],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['code-block', 'formula'],
      ['clean'],
    ],
  }

  const formats = [
    // Inline formats
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'table',
    'size',
    'strike',
    'script',
    'underline',
    // Block formats
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    // Embeds
    'formula',
    'image',
    'video',
  ]

  return (
    <div className="container">
      <div className="m-5">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 ">
            <div className="login-card">
              <div className="heading heading-1 text--center">
                <h2 className="heading-title">Create Department</h2>
              </div>
              <div className="login-body">
                <form className="" onSubmit={handleSubmit}>
                  <div className="row align-items-center">
                    <div className="col-6">
                      <label>Department Title</label>
                      <input
                        className="form-control"
                        type="text"
                        name="title"
                        placeholder="Enter Department title"
                        value={myForm.title}
                        onChange={handleChange}
                      />
                      {errors.title && (
                        <p className="text-danger">{errors.title}</p>
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <div className="d-flex justify-content-start align-items-center gap-2">
                        <input
                          className="form-check-input p-2"
                          type="checkbox"
                          value={(myForm.is_featured = 1)}
                          id="is_featured"
                          name="is_featured"
                          onChange={handleChange}
                        />
                        <label
                          className="fw-bold text-black fs-5"
                          htmlFor="is_featured"
                        >
                          Feature Department
                        </label>
                      </div>
                    </div>

                    <div className="col-6">
                      <label className="fw-bold text-black">Image</label>
                      <input
                        name="image"
                        type="file"
                        className="form-control text-center"
                        onChange={handleUpload}
                      />
                      {errors.image && (
                        <p className="text-danger">{errors.image}</p>
                      )}
                    </div>
                    <div className="col-6">
                      <label className="fw-bold text-black">
                        Uploaded Image
                      </label>
                      <img
                        src={`https://qih.diyarmarketing.com/${myForm.image}`}
                        alt="department image"
                        width={150}
                        height={'auto'}
                      />
                    </div>

                    <div className="col-12 mb-5">
                      <label>Department Description</label>
                      <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={myForm.description}
                        style={{ height: '260px' }}
                        onChange={(value) =>
                          setMyForm({ ...myForm, description: value })
                        }
                      />
                      {errors.description && (
                        <p className="text-danger">{errors.description}</p>
                      )}
                    </div>

                    <div className="col-12 mt-5">
                      <button className="btn btn--primary" type="submit">
                        Save
                      </button>
                    </div>
                    <div className="col-12">
                      <div className="login-result"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateDepartment