import { respondError } from './helpers';

export function catchError(next: Function) {
    return async function (...args: any[]) {
        try {
            return await next(...args);
        } catch (err) {
            return respondError(err.message);
        }
    }
}
