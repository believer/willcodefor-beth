import { Context, Env } from 'hono'

export type C<T extends string> = Context<Env, T, {}>
