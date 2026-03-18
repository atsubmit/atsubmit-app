import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { Form } from "../Form";
import { Submission } from "../Submission";

export const paginateSubmission = async (
    c: MainContext,
    data: {
        user_id: string;
        page: number;
        limit: number;
        orderBy?: "created_at";
        orderDesc?: boolean;
    },
) => {
    const orderBy =
        data.orderBy && data.orderBy === "created_at"
            ? data.orderBy
            : "created_at";
    const direction = data.orderDesc ? "DESC" : "ASC";
    const offset = (data.page - 1) * data.limit;

    const query = `
        SELECT
            s.id,
            s.created_at,
            s.spam_score,
            s.spam_reasons,
            s.spam_checked_at,
            s.raw_headers,

            f.endpoint_slug,
            s.form_id,
            f.name,

            COUNT(s.*) OVER() AS total
        FROM submissions s
        JOIN forms f
            ON s.form_id = f.id
        WHERE user_id = $1
        ORDER BY ${orderBy} ${direction}
        LIMIT $2
        OFFSET $3
    `;

    const params = [data.user_id, data.limit, offset];

    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<
            Pick<
                Submission,
                | "id"
                | "form_id"
                | "raw_headers"
                | "spam_score"
                | "spam_reasons"
                | "spam_checked_at"
                | "created_at"
            > &
                Pick<Form, "name" | "endpoint_slug"> & {
                    total: number;
                }
        >(query, params);
    });

    const rows = result.rows;

    return {
        items: rows.map((item) => {
            return {
                id: item.id,
                created_at: item.created_at,

                spam_score: item.spam_score,
                spam_reasons: item.spam_reasons,
                spam_checked_at: item.spam_checked_at,

                raw_headers: item.raw_headers,

                endpoint_slug: item.endpoint_slug,
                form_id: item.form_id,
                form_name: item.name,

                total: item.total,
            };
        }),
        total: rows.length ? Number(rows[0].total) : 0,
        page: data.page,
        limit: data.limit,
    };
};

export const getSubmission = async (
    c: MainContext,
    data: {
        user_id: string;
        id: string;
    },
) => {
    const query = `
        SELECT
            s.id
            , s.form_id
            , s.ip_address
            , s.payload
            , s.raw_body
            , s.raw_headers
            , s.spam_score
            , s.spam_reasons
            , s.spam_checked_at
            , s.created_at

            , f.endpoint_slug as form_slug
            , f.name          as form_name
        FROM submissions s
        JOIN forms f
            ON s.form_id = f.id
        WHERE
            f.user_id = $1
            AND s.id = $2
        LIMIT 1
    `;

    const params = [data.user_id, data.id];

    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<
            Submission & {
                form_slug: string;
                form_name: string;
            }
        >(query, params);
    });

    return result.rows[0] || null;
};
