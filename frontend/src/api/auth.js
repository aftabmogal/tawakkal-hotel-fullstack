import client from './client'

export const sendOtp = (phone) => client.post('/auth/otp/send/', { phone })

export const verifyOtp = (phone, code) => client.post('/auth/otp/verify/', { phone, code })

export const getMe = () => client.get('/auth/me/')

export const updateMe = (data) => client.patch('/auth/me/', data)

export const getCustomers = () => client.get('/auth/users/')
