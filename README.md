# PHP Aligner

**PHP Aligner** is a Visual Studio Code extension that helps you automatically align your PHP code by organizing assignments and array structures based on `=` and `=>` operators for better readability and consistent formatting.

---

## ✨ Features

- ✅ Align `=` assignments (e.g., properties, constants, function parameters).
- ✅ Align `=>` in associative arrays (even nested arrays).
- ✅ Supports auto-align on file save (configurable).
- ✅ Skips alignment when `=>` is immediately followed by an opening bracket `[` (e.g., nested arrays).
- ✅ Works for entire files — no need to select text.
- ✅ Command palette + keyboard shortcut support.

---

## 📸 Example

### Before

```php
<?php

class User {
    private string $name = "mohamed";
    private int $age = 25;

    public function __construct(
        private string $email = "",
        private string $phoneNumber = "",
    ) {
    }
    
    public function process(
        string $name = "",
        string $email = "",
        string $phoneNumber = "",
        int $age = 0,
    ): void {
        $name1 = "1";
        $phone23 = "dsdS";

        $name234 = "2";
        $phone234 = "dsdS";
    }
}

const PI = 3.14;
const NAME = "mohamed";

$array = [
    "name" => "mohamed",
    "age" => 25,

    "data"                  => [
        "email" => "test@example.com",
        "phone-number" => "1234567890",

        "address"           => [
            "city" => "Cairo",
            "country" => "Egypt"
        ],
    ]
];

enum Status: int {
    case Active = 1;
    case Inactive = 0;
}
```

### After (aligned)

```php
class User {
    private string $name = "mohamed";
    private int $age     = 25;

    public function __construct(
        private string $email       = "",
        private string $phoneNumber = "",
    ) {
    }
    
    public function process(
        string $name        = "",
        string $email       = "",
        string $phoneNumber = "",
        int $age            = 0,
    ): void {
        $name1   = "1";
        $phone23 = "dsdS";

        $name234  = "2";
        $phone234 = "dsdS";
    }
}

const PI   = 3.14;
const NAME = "mohamed";

$array = [
    "name" => "mohamed",
    "age"  => 25,

    "data" => [
        "email"        => "test@example.com",
        "phone-number" => "1234567890",

        "address" => [
            "city"    => "Cairo",
            "country" => "Egypt"
        ],
    ]
];

enum Status: int {
    case Active   = 1;
    case Inactive = 0;
}
```

---

## ⚙️ Extension Settings

| Setting                       | Description                               | Default |
| ----------------------------- | ----------------------------------------- | ------- |
| `php-aligner.autoAlignOnSave` | Automatically align PHP code on file save | `true`  |

You can toggle this setting in **Settings → Extensions → PHP Aligner**.

---

## 🖱 Usage

### Manual

* Open a PHP file
* Press `Ctrl + Alt + A` (or `⌘ + Option + A` on macOS)
* Or run the command `Align PHP Code` from the Command Palette (`Ctrl + Shift + P`)

### Automatic

* By default, the extension will automatically align your PHP code when you save the file (you can disable this in settings).

---

## ⌨️ Keybinding

* `Ctrl + Alt + A` (Windows/Linux)
* `Cmd + Option + A` (macOS)

---

## 🛠 Requirements

* VS Code `v1.101.0` or higher
* PHP files (`.php`) only

---

## 🚀 Installation

You can install the extension via the [VS Code Marketplace](https://marketplace.visualstudio.com/) (after publishing) or manually by packaging and installing it:

```bash
npm install -g vsce
vsce package
```

Then drag the generated `.vsix` file into VS Code or run:

```bash
code --install-extension php-aligner-0.0.1.vsix
```

---

## ☕ Support the Developer

If you find this extension helpful, consider [sponsoring me on GitHub](https://github.com/sponsors/mohamed-samir907) to support further development! or starring the project ❤️

---

## 🧠 How It Works

* Scans your file for sequences of lines with `=` or `=>`.
* Groups them and aligns the right-hand side values by padding the left-hand side consistently.
* Automatically skips lines like:
  `"key" => [` to avoid breaking nested structures.
* Designed to not conflict with other formatters.

---

## 🧪 Contributing

Feel free to open issues or submit PRs if you find bugs or want to improve the alignment rules.

---

## 📄 License

MIT
