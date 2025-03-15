import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/** @type {import('rollup').RollupOptions} */
export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.cjs.js",
            format: "commonjs", // ESM format
            exports: "named",
        },
        {
            file: "dist/index.js",
            format: "esm", // ESM format
            exports: "named",
        },
        {
            file: "dist/index.umd.js",
            format: "umd",
            name: "FormVal",
            exports: "named",
            globals: {
                zod: "Zod",
            },
        },
    ],
    external: ["zod"],
    plugins: [
        commonjs({
            include: /node_modules/,
        }),
        resolve(),
        typescript({ tsconfig: "./tsconfig.json" }),
    ],
};
