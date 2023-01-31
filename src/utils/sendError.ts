import { Response } from 'express'

const SendError = (res: Response, err: any, message?: any, code?: any) => {

    // Console the error
    process.stdout.write(`\n⛔️ Error:\n ${JSON.stringify(err)} \n \n`)

    // Return the error
    return res.status(code || 500).json({
        message: message || 'Internal server error!',
        error: JSON.stringify(err)
    })
}

// Export Module
export { SendError }