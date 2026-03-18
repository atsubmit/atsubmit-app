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
            s.form_id,
            f.name,
            s.created_at,
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
            Pick<Submission, "id" | "form_id" | "created_at"> &
                Pick<Form, "name"> & {
                    total: number;
                }
        >(query, params);
    });

    const rows = result.rows;

    return {
        items: rows.map((item) => {
            return {
                id: item.id,
                form_id: item.form_id,
                form_name: item.name,
                created_at: item.created_at,
                total: item.total,
            };
        }),
        total: rows.length ? Number(rows[0].total) : 0,
        page: data.page,
        limit: data.limit,
    };
};
