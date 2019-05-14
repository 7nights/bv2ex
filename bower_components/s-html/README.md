# &lt;s-html&gt;

Element wrapper of `.innerHTML` for data binding with HTML elements.

## Usage

### Example 1

Localize text with HTML elements using [app-localize-behavior](https://github.com/PolymerElements/app-localize-behavior).

locales.json
```json
{
"text": "<a href=\"/settings\">Settings</a>"
}
```

HTML
```html
<s-html html="[[localize('text')]]"></s-html>
```

### Example 2

Using `span` element for content styled with CSS.

locales.json
```json
{
"text": "<a class=\"red\" href=\"/settings\">Settings</a>"
}
```

CSS
```css
.red {
  color: red;
}
```

HTML
```html
<s-html html="[[localize('text')]]"><span></span></s-html>
```

### Example 3

Unescape escaped HTML elements.

locales.json
```json
{
"text": "polymer &lt;br&gt;"
}
```

HTML
```html
<s-html unescape html="[[localize('text')]]"></s-html>
```

## Installation

`bower i s-html -S`
