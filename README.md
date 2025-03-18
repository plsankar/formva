# Formva

Formva is a lightweight, vanilla JavaScript form validation library that integrates with Zod, a TypeScript-first schema declaration and validation library.
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![GitHub contributors](https://img.shields.io/github/contributors/plsankar/formva)
![NPM Downloads](https://img.shields.io/npm/d18m/formva)
![NPM Version](https://img.shields.io/npm/v/formva)
![npm bundle size](https://img.shields.io/bundlephobia/min/formva)
![NPM Last Update](https://img.shields.io/npm/last-update/formva)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hy/formva)
![Gitea Issues](https://img.shields.io/gitea/issues/all/plsankar/formva)


## Installation

Install with package managers

```bash
  npm install formva
```

```bash
  pnpm add formva
```

Add via CDN links

```html
<script src="https://unpkg.com/formva"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/formva@latest/dist/index.umd.min.js"></script>
```

## Usage/Examples

```javascript
var formSchema = z.object({
    email: z
        .string()
        .email("Please provide a valid email"),
    password: z.string().min(6, "Password is too short"),
    confirm: z.string().min(6, "Password is too short"),
    accepted: z.coerce.boolean().refine((data) => data === true, {
        message: "You must accept the terms and conditions",
    }),
}).refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
});

formva({
    formEl: document.querySelector("form"),
    schema: formSchema,
    submitHandler: (form, event, data) => {
        event.preventDefault();
        console.log(data);
        console.log("Form submitted");
    },
});
```

```html
<form novalidate>
    <div>
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
    </div>
    <div>
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" name="password" class="form-control" id="exampleInputPassword1" />
    </div>
    <div>
        <label for="exampleInputPassword1Confirm" class="form-label">Confirm Password</label>
        <input type="password" name="confirm" class="form-control" id="exampleInputPassword1Confirm" />
    </div>
    <div class="mb-3 form-check">
        <input type="checkbox" name="accepted" value="true" class="form-check-input" id="exampleCheck1" required />
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Contributing

Contributions are always welcome!

## License

[MIT](https://choosealicense.com/licenses/mit/)


## Acknowledgements

 - [Zod](https://zod.dev/)
