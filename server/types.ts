import type { Context, Hono, Input } from "hono";
import type { BlankSchema } from "hono/types";
import type { Pool } from "pg";

export interface MainBindings extends Env {}
export interface MainVariables {
    sid?: string;
    start?: number;
    reqId?: string;
    logger?: (...args: unknown[]) => void;

    pgPool?: Pool;
}

export type MainEnv = {
    Bindings: MainBindings;
    Variables: MainVariables;
};

export type MainSchema = BlankSchema;

export type MainHono<BasePath extends string = "/"> = Hono<
    MainEnv,
    MainSchema,
    BasePath
>;

export type WebHono<BasePath extends string = "/"> = Hono<
    MainEnv,
    MainSchema,
    BasePath
>;

export type WebApiHono<BasePath extends string = "/webapi"> = Hono<
    MainEnv,
    MainSchema,
    BasePath
>;

export type ApiHono<BasePath extends string = "/api"> = Hono<
    MainEnv,
    MainSchema,
    BasePath
>;

export type MainContext<
    P extends string = any,
    I extends Input = object,
> = Context<MainEnv, P, I>;
