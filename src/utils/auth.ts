// Import Auth Model
import { Auth } from '../api/models'

// Import Express Types
import { NextFunction, Request, Response } from 'express'

// Import SendError Module
import { SendError } from '.'

// Import JWT Module
import { verify } from 'jsonwebtoken'

/**
 * This function is responsible for verifying the token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const verifyAccessToken = async (req: any, res: Response, next: NextFunction) => {
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

        next()
        // verify(token, process.env.JWT_ACCESS_KEY || '', (err: any, decoded: any) => {
        //     if (err || !decoded) {
        //         return res.status(401).json({
        //             message: 'Unauthorized request, it must have a valid authorization token!'
        //         })
        //     } else {

        //         // Throw Error, if user is disabled
        //         if (decoded.active == false) {
        //             return res.status(401).json({
        //                 message: 'Unauthorized request, user is disabled from the system!'
        //             })
        //         }
        //         else {
        //             req.user = decoded
        //             next()
        //         }
        //     }
        // })
    } catch (err) {
        return SendError(res, err)
    }
}

/**
 * This function is responsible for checking if the current user is loggedIn or not
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const isLoggedIn = async (req: any, res: Response, next: NextFunction) => {
    try {

        // Authorization header is not present on request
        if (!req.headers.authorization || !req.user) {
            return res.status(401).json({
                message: 'Unauthorized request, it must include an authorization header!'
            })
        }

        // Find if auth is available in the logs
        const auth = await Auth.findOne({
            where: {
                user_id: req.user.user_id,
                logged_in: true,
                token: req.headers.authorization.split(' ')[1]
            }
        })

        // If exists then, pass the request
        if (!!auth) {
            next()
        } else {
            return res.status(400).json({
                message: 'Bad request, either user never logged in or has already been logged out from the system!'
            })
        }

    } catch (err) {
        return SendError(res, err, 'Unauthorized request, Please sign in to continue!', 401)
    }
}

const loginToAuth0 = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (err) {

    }
}

export {
    verifyAccessToken,
    isLoggedIn
}