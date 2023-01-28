import { Response } from 'express'

const SendError = (res: Response, err: any) => {

    // Console the error
    process.stdout.write(`\n⛔️ Error:\n ${JSON.stringify(err)} \n \n`)

    // Return the error
    return res.status(500).json({
        message: 'Internal server error!',
        error: JSON.stringify(err)
    })
}

// Export Module
export { SendError }