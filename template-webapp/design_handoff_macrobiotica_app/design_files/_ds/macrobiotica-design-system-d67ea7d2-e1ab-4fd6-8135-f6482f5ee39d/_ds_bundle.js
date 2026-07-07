/* @ds-bundle: {"format":3,"namespace":"MacrobioticaDesignSystem_d67ea7","components":[{"name":"BalanceMeter","sourcePath":"components/brand/BalanceMeter.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"ThemeToggle","sourcePath":"components/brand/ThemeToggle.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"CareScreen","sourcePath":"ui_kits/app/CareScreen.jsx"},{"name":"FoodsScreen","sourcePath":"ui_kits/app/FoodsScreen.jsx"},{"name":"LearnScreen","sourcePath":"ui_kits/app/LearnScreen.jsx"},{"name":"TodayScreen","sourcePath":"ui_kits/app/TodayScreen.jsx"}],"sourceHashes":{"components/brand/BalanceMeter.jsx":"248164adfdf6","components/brand/Icon.jsx":"ee84710d4f77","components/brand/ThemeToggle.jsx":"a3dd4912a619","components/core/Badge.jsx":"10a1a0c60fcd","components/core/Button.jsx":"66ccaa9baec4","components/core/Card.jsx":"e93b27d9e37f","components/core/IconButton.jsx":"ceae573732f5","components/core/Tag.jsx":"71a79c7d416f","components/feedback/Dialog.jsx":"19ab85be3ee6","components/feedback/Toast.jsx":"dd58c1e540a7","components/feedback/Tooltip.jsx":"07fcfcae98f4","components/forms/Checkbox.jsx":"1c05a24c2eb1","components/forms/Input.jsx":"fd9a6d4572ab","components/forms/Radio.jsx":"84ea0ad05233","components/forms/Select.jsx":"3cd228f11879","components/forms/Switch.jsx":"c6ed692abe3a","components/navigation/Tabs.jsx":"29997ce0683c","ui_kits/app/CareScreen.jsx":"f30c461c58e1","ui_kits/app/FoodsScreen.jsx":"26037c247f82","ui_kits/app/LearnScreen.jsx":"376f20d3beaa","ui_kits/app/TodayScreen.jsx":"deb5be766750"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MacrobioticaDesignSystem_d67ea7 = window.MacrobioticaDesignSystem_d67ea7 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/BalanceMeter.jsx
try { (() => {
function BalanceMeter({
  value = 0,
  label,
  showLabels = true,
  size = 'md',
  className = '',
  style
}) {
  const clamped = Math.max(-1, Math.min(1, Number(value) || 0));
  const pct = (clamped + 1) / 2 * 100;
  const cls = ['mb-balance', size === 'sm' && 'mb-balance--sm', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-balance__track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-balance__marker",
    style: {
      left: pct + '%'
    }
  })), showLabels && /*#__PURE__*/React.createElement("div", {
    className: "mb-balance__labels"
  }, /*#__PURE__*/React.createElement("span", null, "Yin \u9670"), label && /*#__PURE__*/React.createElement("span", {
    className: "mb-balance__note"
  }, label), /*#__PURE__*/React.createElement("span", null, "\u967D Yang")));
}
Object.assign(__ds_scope, { BalanceMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BalanceMeter.jsx", error: String((e && e.message) || e) }); }

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LUCIDE_SRC = 'https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js';
let lucidePromise = null;
function loadLucide() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.lucide) return Promise.resolve(window.lucide);
  if (!lucidePromise) {
    lucidePromise = new Promise((resolve, reject) => {
      let s = document.querySelector(`script[data-mb-lucide]`);
      if (!s) {
        s = document.createElement('script');
        s.src = LUCIDE_SRC;
        s.setAttribute('data-mb-lucide', '');
        document.head.appendChild(s);
      }
      s.addEventListener('load', () => resolve(window.lucide));
      s.addEventListener('error', reject);
    });
  }
  return lucidePromise;
}
function toPascal(name) {
  return String(name).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
function Icon({
  name,
  size = 18,
  strokeWidth = 1.75,
  color = 'currentColor',
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let alive = true;
    loadLucide().then(lucide => {
      if (!alive || !ref.current || !lucide) return;
      const registry = lucide.icons || lucide;
      const node = registry[toPascal(name)];
      if (!node) {
        console.warn('[Macrobiotica] Unknown icon:', name);
        return;
      }
      const svg = lucide.createElement(node);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('stroke-width', strokeWidth);
      ref.current.replaceChildren(svg);
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      color,
      flex: 'none',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/ThemeToggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function currentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}
function ThemeToggle({
  size = 'md',
  className = '',
  ...rest
}) {
  const [theme, setTheme] = React.useState(currentTheme);
  React.useEffect(() => {
    setTheme(currentTheme());
  }, []);
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('mb-theme', next);
    } catch (e) {/* private mode */}
    setTheme(next);
  };
  const cls = ['mb-icon-btn', size !== 'md' && `mb-icon-btn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    onClick: toggle
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: theme === 'dark' ? 'sun' : 'moon'
  }));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Badge({
  tone = 'neutral',
  dot = false,
  className = '',
  children,
  ...rest
}) {
  const cls = ['mb-badge', tone !== 'neutral' && `mb-badge--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "mb-badge__dot"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const cls = ['mb-btn', `mb-btn--${variant}`, size !== 'md' && `mb-btn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  raised = false,
  flat = false,
  padding = 20,
  className = '',
  style,
  children,
  ...rest
}) {
  const cls = ['mb-card', raised && 'mb-card--raised', flat && 'mb-card--flat', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    style: {
      padding,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  variant = 'ghost',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['mb-icon-btn', variant !== 'ghost' && `mb-icon-btn--${variant}`, size !== 'md' && `mb-icon-btn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tag({
  active = false,
  onRemove,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['mb-tag', active && 'mb-tag--active', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    "aria-pressed": active
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "mb-tag__x",
    role: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove();
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  width = 420
}) {
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-dialog-overlay",
    onMouseDown: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-dialog",
    role: "dialog",
    "aria-modal": "true",
    style: {
      width: `min(${width}px, calc(100vw - 32px))`
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    className: "mb-dialog__title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "mb-dialog__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "mb-dialog__footer"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  tone = 'neutral',
  title,
  description,
  onDismiss,
  className = '',
  style
}) {
  const cls = ['mb-toast', tone !== 'neutral' && `mb-toast--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: style,
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-toast__dot"
  }), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    className: "mb-toast__title"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "mb-toast__desc"
  }, description)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mb-icon-btn mb-icon-btn--sm mb-toast__close",
    "aria-label": "Dismiss",
    onClick: onDismiss
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  side = 'top',
  children,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ['mb-tooltip', className].filter(Boolean).join(' '),
    style: style
  }, children, /*#__PURE__*/React.createElement("span", {
    className: 'mb-tooltip__bubble' + (side === 'bottom' ? ' mb-tooltip__bubble--bottom' : ''),
    role: "tooltip"
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  description,
  className = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ['mb-choice', className].filter(Boolean).join(' '),
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    className: "mb-checkbox"
  }, rest)), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  id,
  className = '',
  style,
  ...rest
}) {
  const autoId = React.useId();
  const inputId = id || autoId;
  return /*#__PURE__*/React.createElement("div", {
    className: ['mb-field', className].filter(Boolean).join(' '),
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "mb-field__label",
    htmlFor: inputId
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: 'mb-input' + (error ? ' mb-input--error' : ''),
    "aria-invalid": error ? true : undefined
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    className: "mb-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "mb-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Radio({
  label,
  description,
  className = '',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ['mb-choice', className].filter(Boolean).join(' '),
    style: style
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "radio",
    className: "mb-radio"
  }, rest)), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__desc"
  }, description)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  hint,
  error,
  id,
  className = '',
  style,
  children,
  ...rest
}) {
  const autoId = React.useId();
  const selectId = id || autoId;
  return /*#__PURE__*/React.createElement("div", {
    className: ['mb-field', className].filter(Boolean).join(' '),
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "mb-field__label",
    htmlFor: selectId
  }, label), /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    className: 'mb-select' + (error ? ' mb-input--error' : ''),
    "aria-invalid": error ? true : undefined
  }, rest), children), error ? /*#__PURE__*/React.createElement("span", {
    className: "mb-field__error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "mb-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  label,
  description,
  className = '',
  style,
  ...rest
}) {
  const control = /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    className: "mb-switch"
  }, rest));
  if (!label && !description) return control;
  return /*#__PURE__*/React.createElement("label", {
    className: ['mb-choice', 'mb-choice--switch', className].filter(Boolean).join(' '),
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__text"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__label"
  }, label), description && /*#__PURE__*/React.createElement("span", {
    className: "mb-choice__desc"
  }, description)), control);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ['mb-tabs', className].filter(Boolean).join(' '),
    style: style,
    role: "tablist"
  }, items.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.id,
    type: "button",
    role: "tab",
    "aria-selected": value === item.id,
    className: 'mb-tab' + (value === item.id ? ' mb-tab--active' : ''),
    onClick: () => onChange && onChange(item.id)
  }, item.label)));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/CareScreen.jsx
try { (() => {
function describe(v) {
  if (v > 0.35) return 'More yang';
  if (v > 0.1) return 'Slightly yang';
  if (v >= -0.1) return 'Near balance';
  if (v >= -0.35) return 'Slightly yin';
  return 'More yin';
}
function CareScreen() {
  const [people, setPeople] = React.useState([{
    name: 'Yuki',
    relation: 'Partner',
    v: -0.1
  }, {
    name: 'Dad',
    relation: 'Parent',
    v: 0.45
  }]);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [relation, setRelation] = React.useState('Partner');
  const add = () => {
    if (!name.trim()) return;
    setPeople([...people, {
      name: name.trim(),
      relation,
      v: 0
    }]);
    setName('');
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Card, {
    className: "rows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-title"
  }, "Tonight's dinner"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, "Kabocha stew \xB7 serves ", people.length + 1, " \xB7 a little extra ginger for Dad")))), /*#__PURE__*/React.createElement("div", {
    className: "sect"
  }, "People you cook for"), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    className: "rows"
  }, people.map(p => /*#__PURE__*/React.createElement("div", {
    className: "row",
    key: p.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-title"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, p.relation, " \xB7 ", describe(p.v))), /*#__PURE__*/React.createElement(__ds_scope.BalanceMeter, {
    value: p.v,
    size: "sm",
    showLabels: false,
    style: {
      width: 96
    }
  })))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    onClick: () => setOpen(true)
  }, "Add someone"), /*#__PURE__*/React.createElement(__ds_scope.Dialog, {
    open: open,
    onClose: () => setOpen(false),
    title: "Add someone",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
      variant: "ghost",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
      onClick: add
    }, "Add"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      paddingTop: 4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Input, {
    label: "Name",
    placeholder: "e.g. Yuki",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(__ds_scope.Select, {
    label: "Relationship",
    value: relation,
    onChange: e => setRelation(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "Partner"), /*#__PURE__*/React.createElement("option", null, "Parent"), /*#__PURE__*/React.createElement("option", null, "Child"), /*#__PURE__*/React.createElement("option", null, "Friend"), /*#__PURE__*/React.createElement("option", null, "Client")))));
}
Object.assign(__ds_scope, { CareScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/CareScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/FoodsScreen.jsx
try { (() => {
const FOODS = [{
  name: 'Brown rice',
  cat: 'Grains',
  v: 0
}, {
  name: 'Millet',
  cat: 'Grains',
  v: 0.05
}, {
  name: 'Kabocha squash',
  cat: 'Vegetables',
  v: 0.1
}, {
  name: 'Daikon',
  cat: 'Vegetables',
  v: -0.25
}, {
  name: 'Shiitake',
  cat: 'Vegetables',
  v: -0.4
}, {
  name: 'Azuki beans',
  cat: 'Beans',
  v: 0.15
}, {
  name: 'Tofu',
  cat: 'Beans',
  v: -0.3
}, {
  name: 'Kombu',
  cat: 'Sea vegetables',
  v: 0.2
}, {
  name: 'Miso',
  cat: 'Fermented',
  v: 0.35
}, {
  name: 'Umeboshi',
  cat: 'Fermented',
  v: 0.55
}, {
  name: 'Apple',
  cat: 'Fruit',
  v: -0.35
}];
const CATS = ['All', 'Grains', 'Vegetables', 'Beans', 'Sea vegetables', 'Fermented', 'Fruit'];
function FoodsScreen() {
  const [query, setQuery] = React.useState('');
  const [cat, setCat] = React.useState('All');
  const shown = FOODS.filter(f => (cat === 'All' || f.cat === cat) && f.name.toLowerCase().includes(query.trim().toLowerCase()));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    className: "mb-input",
    placeholder: "Search foods",
    value: query,
    onChange: e => setQuery(e.target.value),
    "aria-label": "Search foods"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, CATS.map(c => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: c,
    active: cat === c,
    onClick: () => setCat(c)
  }, c))), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    className: "rows"
  }, shown.map(f => /*#__PURE__*/React.createElement("div", {
    className: "row",
    key: f.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-title"
  }, f.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, f.cat)), /*#__PURE__*/React.createElement(__ds_scope.BalanceMeter, {
    value: f.v,
    size: "sm",
    showLabels: false,
    style: {
      width: 96
    }
  }))), shown.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      padding: '8px 0'
    }
  }, "Nothing here yet \u2014 try another word."))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      textAlign: 'center'
    }
  }, "Left is yin \u9670 \xB7 right is yang \u967D \xB7 center is balance"));
}
Object.assign(__ds_scope, { FoodsScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/FoodsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/LearnScreen.jsx
try { (() => {
const COURSES = [{
  title: 'Foundations of Balance',
  done: 4,
  total: 9
}, {
  title: 'The Standard Plate',
  done: 0,
  total: 7
}, {
  title: 'Seasonal Cooking',
  done: 0,
  total: 6
}, {
  title: 'Cooking for Others',
  done: 0,
  total: 8
}];
function LearnScreen() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Card, {
    raised: true,
    padding: 24
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-caps",
    style: {
      marginBottom: 10
    }
  }, "Continue"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-2xl)',
      fontWeight: 500,
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1.15
    }
  }, "The energy of cooking"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-muted)',
      margin: '6px 0 16px'
    }
  }, "Foundations of Balance \xB7 Lesson 4 of 9"), /*#__PURE__*/React.createElement("div", {
    className: "progress",
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: '40%'
    }
  })), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm"
  }, "Continue lesson")), /*#__PURE__*/React.createElement("div", {
    className: "sect"
  }, "Courses"), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    className: "rows"
  }, COURSES.map(c => /*#__PURE__*/React.createElement("div", {
    className: "row",
    key: c.title
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-title"
  }, c.title), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, c.done, " of ", c.total, " lessons")), /*#__PURE__*/React.createElement("div", {
    className: "progress",
    style: {
      width: 64
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: `${c.done / c.total * 100}%`
    }
  }))))));
}
Object.assign(__ds_scope, { LearnScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/LearnScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TodayScreen.jsx
try { (() => {
function TodayScreen({
  balance = 0.2,
  balanceNote = 'Slightly yang',
  mealsLogged = 2,
  meals = [],
  onLogDinner
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(__ds_scope.Card, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-caps",
    style: {
      marginBottom: 14
    }
  }, "Your balance"), /*#__PURE__*/React.createElement(__ds_scope.BalanceMeter, {
    value: balance,
    label: balanceNote
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 12
    }
  }, "Based on ", mealsLogged, " ", mealsLogged === 1 ? 'meal' : 'meals', " logged today")), /*#__PURE__*/React.createElement("div", {
    className: "sect"
  }, "Meals"), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    className: "rows"
  }, meals.map(meal => /*#__PURE__*/React.createElement("div", {
    className: "row",
    key: meal.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-title"
  }, meal.name), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, meal.items || 'Not yet logged')), meal.items ? /*#__PURE__*/React.createElement("span", {
    className: "row-val"
  }, meal.value > 0 ? '+' : '', meal.value.toFixed(1)) : /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onLogDinner
  }, "Log")))), /*#__PURE__*/React.createElement("div", {
    className: "sect"
  }, "Today's practice"), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    className: "rows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "book-open",
    size: 20,
    color: "var(--text-muted)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "row-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-title"
  }, "Chewing well"), /*#__PURE__*/React.createElement("div", {
    className: "row-sub"
  }, "Foundations of Balance \xB7 5 min read")), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    size: "sm",
    "aria-label": "Open lesson"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 16
  })))));
}
Object.assign(__ds_scope, { TodayScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BalanceMeter = __ds_scope.BalanceMeter;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.CareScreen = __ds_scope.CareScreen;

__ds_ns.FoodsScreen = __ds_scope.FoodsScreen;

__ds_ns.LearnScreen = __ds_scope.LearnScreen;

__ds_ns.TodayScreen = __ds_scope.TodayScreen;

})();
