import type { ZodIssue, ZodObject, ZodTypeAny } from "zod";
import { ZodError } from "zod";

import { debounce } from "./utils";

export function isZodError(err: unknown): err is ZodError {
    return Boolean(err && (err instanceof ZodError || (err as ZodError).name === "ZodError"));
}

function transformIssues(issues: ZodIssue[]) {
    const transformedObject: { [key: string]: ZodIssue[] } = {};
    Object.values(issues).forEach((issue) => {
        issue.path
            .map((e) => e.toString())
            .forEach((path) => {
                if (!transformedObject[path]) {
                    transformedObject[path] = [];
                }
                transformedObject[path].push(issue);
            });
    });
    return transformedObject;
}

const DEFAULT_HTMLCLASSES: HTMLClasses = {
    form: "was-validated",
    feedback: "",
    feedbackError: "invalid-feedback",
};

class FormVal {
    formEl: HTMLFormElement;
    schema: ZodSchema;
    submitHandler: SubmitHanlder;
    classes?: HTMLClasses = DEFAULT_HTMLCLASSES;

    issues: ZodIssue[] | null = null;
    formDataObject: FormDataObject = {};

    handleChange: () => void;

    constructor(formEl: HTMLFormElement, schema: ZodSchema, submitHandler: SubmitHanlder, classes?: HTMLClasses) {
        this.formEl = formEl;
        this.schema = schema;
        this.submitHandler = submitHandler;
        if (classes) {
            this.classes = Object.assign(classes, DEFAULT_HTMLCLASSES);
        }
        this.handleChange = debounce(this.onChange.bind(this), 500);
        this.init();
    }

    init() {
        this.formEl.removeEventListener("submit", this.onSubmit.bind(this));
        this.formEl.addEventListener("submit", this.onSubmit.bind(this));
    }

    onSubmit(event: SubmitEvent) {
        const { valid, data } = this.validate();

        if (valid) {
            this.submitHandler(this.formEl, event, data);
        } else {
            event.preventDefault();
        }
    }

    validate():
        | {
              valid: false;
              data: null;
          }
        | {
              valid: true;
              data: FormDataObject;
          } {
        this.issues = [];
        const formData = new FormData(this.formEl);

        this.formDataObject = {};

        formData.forEach((value, key) => {
            this.formDataObject[key] = value;
        });

        // @source https://openjavascript.info/2022/12/13/get-checked-checkbox-values-from-html-form-with-javascript/
        this.formEl.querySelectorAll<HTMLInputElement>('[type="checkbox"]').forEach((item) => {
            if (item.checked === true && item.name) {
                this.formDataObject[item.name] = item.value;
            }
        });

        const parsed = this.schema.safeParse(this.formDataObject);

        if (parsed.error) {
            const { issues } = parsed.error;
            this.issues = issues;
            this.render();
            return { valid: false, data: null };
        } else {
            this.render();
            return { valid: true, data: parsed.data };
        }
    }

    onChange() {
        this.validate();
    }

    render() {
        if (this.classes?.form) {
            this.formEl.classList.add(this.classes?.form);
        }

        Object.keys(this.formDataObject).forEach((path) => {
            const el = this.formEl.querySelector<HTMLInputElement>(`[name="${path}"]`);
            if (!el) {
                return;
            }
            el.setCustomValidity("");

            el.removeEventListener("change", this.handleChange.bind(this));
            el.addEventListener("change", this.handleChange.bind(this));

            el.removeEventListener("keyup", this.handleChange.bind(this));
            el.addEventListener("keyup", this.handleChange.bind(this));
        });

        this.formEl.querySelectorAll(".formval-feedback").forEach((el) => el.remove());

        if (this.issues == null || this.issues?.length == 0) {
            return;
        }

        const _issues = transformIssues(this.issues);

        Object.keys(_issues).forEach((path) => {
            const el = this.formEl.querySelector<HTMLInputElement>(`[name="${path}"]`);
            if (!el) {
                return;
            }
            const joinedMessages = _issues[path].map((issue) => issue.message).join("<br>");

            el.setCustomValidity(joinedMessages);
            const feedbackEl = document.createElement("div");
            feedbackEl.className = `formval-feedback formval-feedback-error`;
            if (this.classes?.feedback) {
                feedbackEl.classList.add(this.classes.feedback);
            }
            if (this.classes?.feedbackError) {
                feedbackEl.classList.add(this.classes.feedbackError);
            }
            feedbackEl.innerHTML = joinedMessages;

            if (el.nextElementSibling && el.nextElementSibling.tagName == "LABEL") {
                const label = el.nextElementSibling;
                el.parentNode?.insertBefore(feedbackEl, label.nextSibling);
            } else {
                el.parentNode?.insertBefore(feedbackEl, el.nextSibling);
            }
        });
    }
}

export default function formval({
    formEl,
    schema,
    submitHandler,
    classes,
}: {
    formEl: HTMLFormElement;
    schema: ZodSchema;
    submitHandler: SubmitHanlder;
    classes?: HTMLClasses;
}) {
    if (!formEl) {
        console.error("FormVal: the form element is not present!");
    }
    new FormVal(formEl, schema, submitHandler, classes);
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
window.formval = formval;

type ZodSchema = ZodObject<Record<string, ZodTypeAny>>;

type SubmitHanlder = (formEl: HTMLFormElement, event: SubmitEvent, data: object) => void;

type FormDataObject = { [key: string | number]: unknown };

type HTMLClasses = {
    form: false | string;
    feedback: false | string;
    feedbackError: false | string;
};
