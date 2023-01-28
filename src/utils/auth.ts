// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import SendError Module
import { SendError } from '.'

/**
 * This function is responsible for verifying the token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Authorization header is not present on request
        if (!req.headers.authorization) {
            return res.status(401).json({
                message: 'Unauthorized request, it must include an authorization header!'
            })
        }

        // Fetch the token
        const token = req.headers.authorization.split(' ')[1]

        // Token is not present on authorization header
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized request, it must include an authorization token!'
            })
        }

        // Verify the Token
        next()
    } catch (err) {
        return SendError(res, err)
    }
}

const loginToAuth0 = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (err) {

    }
}

export {
    verifyAccessToken
}