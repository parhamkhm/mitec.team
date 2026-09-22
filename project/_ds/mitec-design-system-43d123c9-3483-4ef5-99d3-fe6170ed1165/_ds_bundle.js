/* @ds-bundle: {"format":4,"namespace":"MitecDesignSystem_43d123","components":[{"name":"FeatureCard","sourcePath":"components/content/FeatureCard.jsx"},{"name":"GlowRule","sourcePath":"components/content/GlowRule.jsx"},{"name":"KeywordRail","sourcePath":"components/content/KeywordRail.jsx"},{"name":"LogoStrip","sourcePath":"components/content/LogoStrip.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"StatBar","sourcePath":"components/content/StatBar.jsx"},{"name":"StatBlock","sourcePath":"components/content/StatBlock.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"ProgressDots","sourcePath":"components/feedback/ProgressDots.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/content/FeatureCard.jsx":"e8db6c5a3a9d","components/content/GlowRule.jsx":"d68921ff7765","components/content/KeywordRail.jsx":"a1d986df591d","components/content/LogoStrip.jsx":"8d89887aba48","components/content/SectionHeading.jsx":"c30e108a2717","components/content/StatBar.jsx":"e1632ebb3999","components/content/StatBlock.jsx":"9d0f30d7f517","components/core/Badge.jsx":"7e3448cda396","components/core/Button.jsx":"36c36f8af443","components/core/Card.jsx":"f14e96cb16b2","components/core/Icon.jsx":"a4d718cc6f76","components/core/IconButton.jsx":"fa8b811e71e9","components/core/Logo.jsx":"68bd68f5d545","components/feedback/Alert.jsx":"84ca89ce27e0","components/feedback/ProgressDots.jsx":"5e455f2f07c6","components/feedback/Tooltip.jsx":"13db12ada739","components/forms/Checkbox.jsx":"a82e42943512","components/forms/Field.jsx":"9d93d501b530","components/forms/Input.jsx":"3c46466a3116","components/forms/Radio.jsx":"2aa3660878d5","components/forms/Select.jsx":"e08004d8c145","components/forms/Switch.jsx":"8b1b7163c54c","components/navigation/Breadcrumb.jsx":"4b15ebc7522a","components/navigation/NavBar.jsx":"78537e592b40","components/navigation/Tabs.jsx":"a273f8445e0f","ui_kits/marketing-site/App.jsx":"6b84393c7d93","ui_kits/marketing-site/ContactScreen.jsx":"2dd9f807ea56","ui_kits/marketing-site/HomeScreen.jsx":"7501cab9fdb4","ui_kits/marketing-site/PortfolioScreen.jsx":"65b1ee5694ba","ui_kits/marketing-site/ServicesScreen.jsx":"d5f9d74b606b","ui_kits/marketing-site/Shell.jsx":"14b35f052169"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MitecDesignSystem_43d123 = window.MitecDesignSystem_43d123 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/GlowRule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The emerald fade divider — a hairline that brightens at centre. */
function GlowRule({
  width = '100%',
  dots = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      width,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--grad-rule)'
    }
  }), dots ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--green-400)',
      boxShadow: 'var(--glow-sm)'
    }
  }) : null, dots ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: 'var(--grad-rule)'
    }
  }) : null);
}
Object.assign(__ds_scope, { GlowRule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/GlowRule.jsx", error: String((e && e.message) || e) }); }

// components/content/KeywordRail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Bronze/ink keyword run separated by emerald dots — the site's closing line. */
function KeywordRail({
  words = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 60,
      height: 1,
      background: 'var(--grad-rule)'
    }
  }), words.map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: w
  }, i > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--green-400)',
      boxShadow: 'var(--glow-sm)'
    }
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--text-h4)',
      letterSpacing: '0.01em',
      color: i % 2 ? 'var(--gold-300)' : 'var(--ink-50)'
    }
  }, w))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 60,
      height: 1,
      background: 'var(--grad-rule)'
    }
  }));
}
Object.assign(__ds_scope, { KeywordRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/KeywordRail.jsx", error: String((e && e.message) || e) }); }

// components/content/LogoStrip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** "Trusted by" rail. Names are set in type — no third-party marks are bundled. */
function LogoStrip({
  label = 'Trusted by 500+ Companies',
  names = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-7)',
      flexWrap: 'wrap',
      padding: 'var(--space-4) var(--space-6)',
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--surface-sunken)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      maxWidth: 130,
      lineHeight: 1.4
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, names.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--text-body-lg)',
      color: 'var(--ink-200)',
      opacity: 0.85,
      letterSpacing: '-0.01em'
    }
  }, n))));
}
Object.assign(__ds_scope, { LogoStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/LogoStrip.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Centred (or left) title block: eyebrow rule, optional italic kicker, headline with a bronze word, sub. */
function SectionHeading({
  eyebrow,
  kicker,
  title,
  emphasis,
  sub,
  align = 'center',
  size = 'display-2',
  style,
  ...rest
}) {
  const sizes = {
    'display-1': {
      fontSize: 'var(--text-display-1)',
      weight: 800
    },
    'display-2': {
      fontSize: 'var(--text-display-2)',
      weight: 800
    },
    'display-3': {
      fontSize: 'var(--text-display-3)',
      weight: 700
    }
  };
  const s = sizes[size] || sizes['display-2'];
  const centred = align === 'center';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      alignItems: centred ? 'center' : 'flex-start',
      textAlign: centred ? 'center' : 'left',
      maxWidth: centred ? 'var(--container-narrow)' : undefined,
      marginInline: centred ? 'auto' : undefined,
      ...style
    }
  }, rest), eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, centred ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 1,
      background: 'var(--grad-rule)'
    }
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-eyebrow)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-action)'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 1,
      background: 'var(--grad-rule)'
    }
  })) : null, kicker ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: 'calc(var(--text-display-3) * 0.62)',
      color: 'var(--text-heading)',
      letterSpacing: '-0.01em',
      lineHeight: 1.1
    }
  }, kicker) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: s.weight,
      fontSize: s.fontSize,
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)',
      color: 'var(--text-heading)',
      margin: 0
    }
  }, emphasis ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, emphasis), ' ') : null, title), sub ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-lead)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-body)',
      maxWidth: 620
    }
  }, sub) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/content/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A single figure + label, bronze numeral over a caption. Used inside StatBar. */
function StatBlock({
  value,
  label,
  tone = 'bronze',
  align = 'center',
  style,
  ...rest
}) {
  const colors = {
    bronze: 'var(--gold-400)',
    emerald: 'var(--green-300)',
    ink: 'var(--text-heading)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 'var(--text-stat)',
      letterSpacing: 'var(--ls-stat)',
      lineHeight: 1.05,
      color: colors[tone]
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      letterSpacing: '0.01em'
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SKINS = {
  glass: {
    background: 'var(--grad-glass)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-body)',
    backdropFilter: 'blur(var(--blur-glass))',
    boxShadow: 'var(--glow-inset)'
  },
  ivory: {
    background: 'var(--grad-ivory)',
    border: '1px solid rgba(255,255,255,.6)',
    color: 'var(--ink-700)',
    boxShadow: 'var(--shadow-ivory)'
  },
  emerald: {
    background: 'var(--grad-emerald-card)',
    border: '1px solid var(--border-accent)',
    color: 'var(--ink-100)',
    boxShadow: 'var(--glow-md), var(--glow-inset)'
  },
  solid: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border-hairline)',
    color: 'var(--text-body)',
    boxShadow: 'var(--shadow-md)'
  }
};

/** The system's surface. Four skins, one radius, hairline borders, no drop shadow on dark. */
function Card({
  children,
  skin = 'glass',
  interactive = false,
  padding,
  className = '',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lit = interactive && hover;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (skin === 'ivory' ? 'mt-on-light ' : '') + className,
    onMouseEnter: interactive ? () => setHover(true) : undefined,
    onMouseLeave: interactive ? () => setHover(false) : undefined,
    style: {
      borderRadius: 'var(--radius-card)',
      padding: padding ?? 'var(--pad-card)',
      transition: 'var(--transition-lift), border-color var(--dur) var(--ease-out), background var(--dur) var(--ease-out)',
      transform: lit ? 'var(--lift-hover)' : 'none',
      ...SKINS[skin],
      ...(lit && skin !== 'ivory' ? {
        borderColor: 'var(--border-accent)',
        boxShadow: 'var(--glow-md), var(--glow-inset)'
      } : null),
      ...(lit && skin === 'ivory' ? {
        boxShadow: 'var(--shadow-lg)'
      } : null),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = 'https://cdn.jsdelivr.net/npm/lucide-static@0.544.0/icons/';

/** Lucide glyph rendered as a CSS mask so it inherits `currentColor`. */
function Icon({
  name = 'circle',
  size = 20,
  label,
  style,
  ...rest
}) {
  const url = CDN + name + '.svg';
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? 'img' : 'presentation',
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    style: {
      display: 'inline-block',
      flex: '0 0 auto',
      width: size,
      height: size,
      backgroundColor: 'currentColor',
      WebkitMaskImage: 'url(' + url + ')',
      maskImage: 'url(' + url + ')',
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/content/FeatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Icon medallion + title + optional body, with the three-dot progress mark. */
function FeatureCard({
  icon,
  title,
  body,
  skin = 'ivory',
  dots = 3,
  activeDot = 0,
  onClick,
  style,
  ...rest
}) {
  const light = skin === 'ivory';
  return /*#__PURE__*/React.createElement(__ds_scope.Card, _extends({
    skin: skin,
    interactive: !!onClick,
    onClick: onClick,
    padding: "var(--space-6)",
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-4)',
      textAlign: 'center',
      cursor: onClick ? 'pointer' : undefined,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--grad-accent)',
      color: 'var(--accent-fg)',
      boxShadow: 'var(--glow-sm)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h4)',
      letterSpacing: 'var(--ls-heading)',
      color: light ? 'var(--ink-900)' : 'var(--ink-0)'
    }
  }, title), body ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: light ? 'var(--ink-500)' : 'var(--ink-200)',
      lineHeight: 'var(--lh-body)'
    }
  }, body) : null, dots ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginTop: 'auto',
      paddingTop: 'var(--space-2)'
    }
  }, Array.from({
    length: dots
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: i === activeDot ? 'var(--green-400)' : light ? 'rgba(14,26,24,.18)' : 'rgba(255,255,255,.22)'
    }
  }))) : null);
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FeatureCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  accent: {
    background: 'var(--accent-soft)',
    color: 'var(--text-action)',
    border: '1px solid var(--border-accent)'
  },
  bronze: {
    background: 'var(--emphasis-soft)',
    color: 'var(--gold-300)',
    border: '1px solid rgba(201,166,130,.35)'
  },
  neutral: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-subtle)'
  },
  solid: {
    background: 'var(--grad-accent)',
    color: 'var(--accent-fg)',
    border: '1px solid transparent'
  }
};

/** Small status/eyebrow pill. */
function Badge({
  children,
  tone = 'accent',
  icon,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
      ...TONES[tone],
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 13
  }) : null, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '8px 16px',
    fontSize: 'var(--text-body-sm)',
    gap: 7,
    icon: 15
  },
  md: {
    padding: 'var(--pad-control-y) var(--pad-control-x)',
    fontSize: 'var(--text-body)',
    gap: 9,
    icon: 17
  },
  lg: {
    padding: '15px 30px',
    fontSize: 'var(--text-body-lg)',
    gap: 10,
    icon: 19
  }
};
const VARIANTS = {
  primary: {
    base: {
      background: 'var(--grad-accent)',
      color: 'var(--accent-fg)',
      border: '1px solid transparent',
      boxShadow: 'var(--glow-sm), var(--glow-inset)'
    },
    hover: {
      background: 'var(--grad-accent-hover)',
      boxShadow: 'var(--glow-md), var(--glow-inset)'
    }
  },
  secondary: {
    base: {
      background: 'var(--surface-card)',
      color: 'var(--text-heading)',
      border: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(var(--blur-glass))'
    },
    hover: {
      background: 'var(--surface-card-hover)',
      borderColor: 'var(--border-strong)'
    }
  },
  outline: {
    base: {
      background: 'transparent',
      color: 'var(--text-action)',
      border: '1px solid var(--border-accent)'
    },
    hover: {
      background: 'var(--accent-soft)',
      color: 'var(--green-200)'
    }
  },
  ghost: {
    base: {
      background: 'transparent',
      color: 'var(--text-body)',
      border: '1px solid transparent'
    },
    hover: {
      color: 'var(--text-heading)',
      background: 'var(--surface-card)'
    }
  }
};

/** The system's action control. One primary per view. */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  fullWidth = false,
  disabled = false,
  as = 'button',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const v = VARIANTS[variant] || VARIANTS.primary;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : undefined,
      gap: s.gap,
      padding: s.padding,
      fontSize: s.fontSize,
      fontFamily: 'var(--font-body)',
      fontWeight: 'var(--weight-bold)',
      lineHeight: 1,
      letterSpacing: '0.005em',
      borderRadius: 'var(--radius-control)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.42 : 1,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      transition: 'var(--transition-control), transform var(--dur-fast) var(--ease-out)',
      transform: press && !disabled ? 'scale(var(--press-scale))' : 'none',
      ...v.base,
      ...(hover && !disabled ? v.hover : null),
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }) : null, children, iconAfter ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconAfter,
    size: s.icon
  }) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/StatBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Glass rail of 3–4 stats with an optional trailing CTA, divided by hairlines. */
function StatBar({
  stats = [],
  cta,
  onCtaClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)',
      flexWrap: 'wrap',
      padding: '18px var(--space-6)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--grad-glass)',
      border: '1px solid var(--border-hairline)',
      backdropFilter: 'blur(var(--blur-glass))',
      boxShadow: 'var(--glow-inset)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      flex: '1 1 380px',
      minWidth: 0
    }
  }, stats.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s.label
  }, i > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      alignSelf: 'stretch',
      background: 'var(--border-hairline)',
      margin: '0 var(--space-3)'
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 0',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    value: s.value,
    label: s.label,
    tone: s.tone
  }))))), cta ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "md",
    iconAfter: "arrow-right",
    onClick: onCtaClick
  }, cta) : null);
}
Object.assign(__ds_scope, { StatBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatBar.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BOX = {
  sm: 32,
  md: 40,
  lg: 48
};

/** Square-ish circular control holding a single glyph. */
function IconButton({
  name,
  variant = 'secondary',
  size = 'md',
  label,
  disabled = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const box = BOX[size] || BOX.md;
  const skins = {
    primary: {
      background: 'var(--grad-accent)',
      color: 'var(--accent-fg)',
      border: '1px solid transparent',
      boxShadow: hover ? 'var(--glow-md)' : 'var(--glow-sm)'
    },
    secondary: {
      background: hover ? 'var(--surface-card-hover)' : 'var(--surface-card)',
      color: 'var(--text-heading)',
      border: '1px solid var(--border-subtle)'
    },
    ghost: {
      background: hover ? 'var(--surface-card)' : 'transparent',
      color: hover ? 'var(--text-heading)' : 'var(--text-muted)',
      border: '1px solid transparent'
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: box,
      height: box,
      padding: 0,
      borderRadius: 'var(--radius-circle)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.42 : 1,
      transition: 'var(--transition-control)',
      ...skins[variant],
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: name,
    size: Math.round(box * 0.45)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Wordmark. No official logo file was supplied for mitec.team, so the mark is
 * set in type: "mi" in bronze, "tec" in ink, tight tracking, Montserrat 800.
 */
function Logo({
  size = 22,
  tone = 'dark',
  style,
  ...rest
}) {
  const primary = tone === 'dark' ? 'var(--ink-0)' : 'var(--ink-900)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: '-0.035em',
      color: primary,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-400)'
    }
  }, "mi"), /*#__PURE__*/React.createElement("span", null, "tec"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontWeight: 800
    }
  }, "."), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 600,
      fontSize: '0.62em',
      letterSpacing: '0.02em',
      marginLeft: 1
    }
  }, "team"));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  info: {
    icon: 'info',
    color: 'var(--info)',
    tint: 'rgba(62,155,212,.12)',
    edge: 'rgba(62,155,212,.35)'
  },
  success: {
    icon: 'check-circle',
    color: 'var(--success)',
    tint: 'var(--accent-soft)',
    edge: 'var(--border-accent)'
  },
  warning: {
    icon: 'alert-triangle',
    color: 'var(--warning)',
    tint: 'rgba(217,164,65,.12)',
    edge: 'rgba(217,164,65,.35)'
  },
  danger: {
    icon: 'octagon-alert',
    color: 'var(--danger)',
    tint: 'rgba(224,84,74,.12)',
    edge: 'rgba(224,84,74,.38)'
  }
};

/** Inline message block. Full hairline border — never a coloured left bar only. */
function Alert({
  tone = 'info',
  title,
  children,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-md)',
      background: t.tint,
      border: '1px solid ' + t.edge,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.color,
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: t.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      minWidth: 0
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 800,
      fontSize: 'var(--text-body)',
      color: 'var(--text-heading)'
    }
  }, title) : null, children ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-body)'
    }
  }, children) : null));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressDots.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The three-dot mark used on feature cards and carousels. */
function ProgressDots({
  count = 3,
  active = 0,
  onSelect,
  tone = 'dark',
  style,
  ...rest
}) {
  const idle = tone === 'dark' ? 'rgba(255,255,255,.22)' : 'rgba(14,26,24,.18)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      ...style
    }
  }, rest), Array.from({
    length: count
  }).map((_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    "aria-label": 'Go to item ' + (i + 1),
    onClick: () => onSelect && onSelect(i),
    style: {
      width: i === active ? 16 : 6,
      height: 6,
      padding: 0,
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: onSelect ? 'pointer' : 'default',
      background: i === active ? 'var(--grad-accent)' : idle,
      boxShadow: i === active ? 'var(--glow-sm)' : 'none',
      transition: 'width var(--dur) var(--ease-out), background var(--dur) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressDots.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Hover label on a solid navy chip. */
function Tooltip({
  label,
  placement = 'top',
  children,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%,-8px)'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translate(-50%,8px)'
    }
  }[placement] || {};
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    },
    onMouseEnter: () => setOpen(true),
    onMouseLeave: () => setOpen(false)
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      ...pos,
      zIndex: 40,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      background: 'var(--navy-700)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--ink-50)',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      boxShadow: 'var(--shadow-md)',
      opacity: open ? 1 : 0,
      transition: 'opacity var(--dur-fast) var(--ease-out)'
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Square check control. Emerald gradient when on. */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 19,
      height: 19,
      borderRadius: 'var(--radius-xs)',
      background: checked ? 'var(--grad-accent)' : 'var(--surface-sunken)',
      border: '1px solid ' + (checked ? 'transparent' : 'var(--border-subtle)'),
      boxShadow: checked ? 'var(--glow-sm)' : 'none',
      color: 'var(--accent-fg)',
      transition: 'var(--transition-control)'
    }
  }, checked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 13
  }) : null), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Label + help/error wrapper shared by every form control. */
function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    htmlFor: htmlFor,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      ...style
    }
  }, rest), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-caption)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label, required ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, " *") : null) : null, children, error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--danger)'
    }
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const shell = (focus, invalid, disabled) => ({
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--text-heading)',
  lineHeight: 1.4,
  padding: '12px 14px',
  borderRadius: 'var(--radius-input)',
  background: disabled ? 'rgba(255,255,255,.02)' : 'var(--surface-sunken)',
  border: '1px solid ' + (invalid ? 'var(--danger)' : focus ? 'var(--border-accent)' : 'var(--border-subtle)'),
  boxShadow: focus ? 'var(--ring-focus)' : 'none',
  outline: 'none',
  transition: 'var(--transition-control)',
  opacity: disabled ? 0.5 : 1
});

/** Single-line text input. Rounded-sm, sunken ground, emerald focus ring. */
function Input({
  icon,
  invalid = false,
  disabled = false,
  multiline = false,
  rows = 4,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const control = /*#__PURE__*/React.createElement(Tag, _extends({
    rows: multiline ? rows : undefined,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...shell(focus, invalid, disabled),
      ...(icon ? {
        paddingLeft: 40
      } : null),
      ...(multiline ? {
        resize: 'vertical',
        fontFamily: 'var(--font-body)'
      } : null),
      ...style
    }
  }, rest));
  if (!icon) return control;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 13,
      top: '50%',
      transform: 'translateY(-50%)',
      color: focus ? 'var(--text-action)' : 'var(--text-muted)',
      transition: 'color var(--dur) var(--ease-out)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 17
  })), control);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Round single-select control. */
function Radio({
  checked = false,
  onChange,
  label,
  name,
  value,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    disabled: disabled,
    onChange: () => onChange && onChange(value),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 19,
      height: 19,
      borderRadius: '50%',
      background: 'var(--surface-sunken)',
      border: '1px solid ' + (checked ? 'var(--green-400)' : 'var(--border-subtle)'),
      boxShadow: checked ? 'var(--glow-sm)' : 'none',
      transition: 'var(--transition-control)'
    }
  }, checked ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: 'var(--grad-accent)'
    }
  }) : null), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const shell = (focus, invalid, disabled) => ({
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-body)',
  color: 'var(--text-heading)',
  lineHeight: 1.4,
  padding: '12px 14px',
  borderRadius: 'var(--radius-input)',
  background: disabled ? 'rgba(255,255,255,.02)' : 'var(--surface-sunken)',
  border: '1px solid ' + (invalid ? 'var(--danger)' : focus ? 'var(--border-accent)' : 'var(--border-subtle)'),
  boxShadow: focus ? 'var(--ring-focus)' : 'none',
  outline: 'none',
  transition: 'var(--transition-control)',
  opacity: disabled ? 0.5 : 1
});

/** Native select with the system's chevron. */
function Select({
  options = [],
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...shell(focus, invalid, disabled),
      appearance: 'none',
      paddingRight: 38,
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, rest), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const label = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value,
      style: {
        background: 'var(--navy-800)'
      }
    }, label);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 13,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-muted)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pill toggle for immediate on/off state. */
function Switch({
  checked = false,
  onChange,
  label,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 11,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.checked),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 42,
      height: 24,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--grad-accent)' : 'var(--surface-sunken)',
      border: '1px solid ' + (checked ? 'transparent' : 'var(--border-subtle)'),
      boxShadow: checked ? 'var(--glow-sm)' : 'none',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: checked ? 20 : 2,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: checked ? 'var(--ink-0)' : 'var(--ink-300)',
      transition: 'left var(--dur) var(--ease-out), background var(--dur) var(--ease-out)',
      boxShadow: 'var(--shadow-sm)'
    }
  })), label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-body)'
    }
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Slash-free breadcrumb using the system's chevron. */
function Breadcrumb({
  items = [],
  onNavigate,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("nav", _extends({
    "aria-label": "Breadcrumb",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      ...style
    }
  }, rest), items.map((item, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: item
    }, i > 0 ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 14
    })) : null, /*#__PURE__*/React.createElement("button", {
      onClick: () => !last && onNavigate && onNavigate(item),
      style: {
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: last ? 'default' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: last ? 700 : 500,
        color: last ? 'var(--text-heading)' : 'var(--text-muted)'
      }
    }, item));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Top bar: wordmark left, centred links with an emerald active underline, CTA right. */
function NavBar({
  items = [],
  active,
  onNavigate,
  cta = 'Get Started',
  onCta,
  sticky = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: 'var(--space-4) var(--space-8)',
      background: 'rgba(6,20,45,.72)',
      backdropFilter: 'blur(var(--blur-scrim))',
      borderBottom: '1px solid var(--border-hairline)',
      position: sticky ? 'sticky' : 'relative',
      top: 0,
      zIndex: 20,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: 21
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-7)',
      marginInline: 'auto'
    }
  }, items.map(item => {
    const on = item === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item,
      onClick: () => onNavigate && onNavigate(item),
      style: {
        position: 'relative',
        background: 'none',
        border: 'none',
        padding: '6px 0',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-body)',
        fontWeight: on ? 700 : 500,
        color: on ? 'var(--text-heading)' : 'var(--text-body)',
        transition: 'color var(--dur) var(--ease-out)'
      }
    }, item, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -2,
        height: 2,
        borderRadius: 2,
        background: on ? 'var(--grad-accent)' : 'transparent',
        boxShadow: on ? 'var(--glow-sm)' : 'none'
      }
    }));
  })), cta ? /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    iconAfter: "arrow-right",
    onClick: onCta
  }, cta) : null);
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Segmented glass tab rail. */
function Tabs({
  items = [],
  active,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-hairline)',
      ...style
    }
  }, rest), items.map(item => {
    const on = item === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item,
      onClick: () => onChange && onChange(item),
      style: {
        padding: '8px 18px',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: 700,
        background: on ? 'var(--grad-accent)' : 'transparent',
        color: on ? 'var(--accent-fg)' : 'var(--text-muted)',
        boxShadow: on ? 'var(--glow-sm)' : 'none',
        transition: 'var(--transition-control)'
      }
    }, item);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/App.jsx
try { (() => {
const MitecKit = window.MitecKit = window.MitecKit || {};
const {
  NavBar
} = window.MitecDesignSystem_43d123;
const {
  Ground,
  Footer,
  HomeScreen,
  ServicesScreen,
  PortfolioScreen,
  ContactScreen
} = window.MitecKit;
function App() {
  const [page, setPage] = React.useState('Home');
  React.useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [page]);
  const screens = {
    Home: HomeScreen,
    Services: ServicesScreen,
    About: ServicesScreen,
    Portfolio: PortfolioScreen,
    Contact: ContactScreen
  };
  const Screen = screens[page] || HomeScreen;
  return /*#__PURE__*/React.createElement(Ground, null, /*#__PURE__*/React.createElement(NavBar, {
    sticky: true,
    items: ['Home', 'Services', 'About', 'Portfolio', 'Contact'],
    active: page,
    onNavigate: setPage,
    cta: "Get Started",
    onCta: () => setPage('Contact')
  }), /*#__PURE__*/React.createElement(Screen, {
    onNavigate: setPage
  }), /*#__PURE__*/React.createElement(Footer, {
    onNavigate: setPage
  }));
}
Object.assign(MitecKit, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/ContactScreen.jsx
try { (() => {
const MitecKit = window.MitecKit = window.MitecKit || {};
const {
  Card,
  Button,
  Icon,
  Field,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,
  Alert,
  SectionHeading,
  Badge,
  GlowRule
} = window.MitecDesignSystem_43d123;
const {
  Section
} = window.MitecKit;
function ContactScreen() {
  const [sent, setSent] = React.useState(false);
  const [budget, setBudget] = React.useState('10-25k');
  const [digest, setDigest] = React.useState(true);
  const [hosting, setHosting] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const invalid = email.length > 0 && !email.includes('@');
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.15fr',
      gap: 'var(--space-10)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    eyebrow: "Contact",
    emphasis: "Tell us what",
    title: "you are launching",
    sub: "A scoped proposal within two business days. No discovery fee, no sales sequence.",
    size: "display-3"
  }), /*#__PURE__*/React.createElement(GlowRule, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, [{
    icon: 'mail',
    label: 'Email',
    value: 'hello@mitec.team'
  }, {
    icon: 'phone',
    label: 'Phone',
    value: '+1 (415) 555-0142'
  }, {
    icon: 'map-pin',
    label: 'Studio',
    value: '210 Harrow Street, Suite 4'
  }, {
    icon: 'clock',
    label: 'Response',
    value: 'Within one business day'
  }].map(r => /*#__PURE__*/React.createElement("div", {
    key: r.label,
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      color: 'var(--text-action)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: r.icon,
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      fontWeight: 800,
      color: 'var(--text-muted)'
    }
  }, r.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--ink-0)'
    }
  }, r.value))))), /*#__PURE__*/React.createElement(Card, {
    skin: "glass",
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    icon: "shield-check"
  }, "NDA ready"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "We will sign yours before the first call."))), /*#__PURE__*/React.createElement(Card, {
    skin: "glass",
    padding: "var(--pad-card-lg)",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, sent ? /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Quote request sent"
  }, "We'll come back to you within one business day at ", email || 'your inbox', ".") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name",
    required: true
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "user",
    placeholder: "Jordan Ellis"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Work email",
    required: true,
    error: invalid ? 'That address is missing an @' : undefined
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "mail",
    type: "email",
    value: email,
    invalid: invalid,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@company.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Company"
  }, /*#__PURE__*/React.createElement(Input, {
    icon: "building-2",
    placeholder: "Northbank Supply"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Service"
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['Website Design', 'SEO & Growth', 'E-Commerce', 'Care & Security']
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Budget"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      flexWrap: 'wrap',
      paddingTop: 2
    }
  }, [['10-25k', '$10k – $25k'], ['25-60k', '$25k – $60k'], ['60k+', '$60k+']].map(([v, l]) => /*#__PURE__*/React.createElement(Radio, {
    key: v,
    name: "budget",
    value: v,
    checked: budget === v,
    onChange: setBudget,
    label: l
  })))), /*#__PURE__*/React.createElement(Field, {
    label: "Brief",
    hint: "Two or three sentences is plenty."
  }, /*#__PURE__*/React.createElement(Input, {
    multiline: true,
    rows: 4,
    placeholder: "We're relaunching a wholesale catalogue and need reorder to take under a minute."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: digest,
    onChange: setDigest,
    label: "Send me the quarterly digest"
  }), /*#__PURE__*/React.createElement(Switch, {
    checked: hosting,
    onChange: setHosting,
    label: "Include managed hosting"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconAfter: "arrow-right",
    disabled: invalid,
    onClick: () => setSent(true)
  }, "Get Free Quote"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    icon: "calendar"
  }, "Book a Call Instead")))));
}
Object.assign(MitecKit, {
  ContactScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/ContactScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/HomeScreen.jsx
try { (() => {
const MitecKit = window.MitecKit = window.MitecKit || {};
const {
  Button,
  Badge,
  Card,
  Icon,
  SectionHeading,
  StatBar,
  FeatureCard,
  LogoStrip,
  KeywordRail,
  ProgressDots
} = window.MitecDesignSystem_43d123;
const {
  Section
} = window.MitecKit;

/** The laptop-screen product shot recreated in DOM: dark app frame, headline, chart panel. */
function ProductFrame() {
  const bars = [34, 46, 40, 58, 52, 72, 66, 88];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'linear-gradient(150deg,#06232A 0%,#071B2E 60%,#05162B 100%)',
      boxShadow: 'var(--shadow-lg), var(--glow-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      padding: '10px 16px',
      borderBottom: '1px solid var(--border-hairline)',
      background: 'rgba(3,12,28,.5)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: '-.03em',
      color: 'var(--ink-0)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-400)'
    }
  }, "mi"), "tec"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 14,
      fontSize: 10.5,
      color: 'var(--ink-300)',
      marginInline: 'auto'
    }
  }, ['Overview', 'Traffic', 'Conversions', 'Reports'].map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      color: i === 0 ? 'var(--ink-0)' : undefined,
      fontWeight: i === 0 ? 700 : 500
    }
  }, t))), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '4px 12px',
      borderRadius: 999,
      background: 'var(--grad-accent)',
      color: '#fff',
      fontSize: 10,
      fontWeight: 800
    }
  }, "Contact Us")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr',
      gap: 'var(--space-5)',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 22,
      lineHeight: 1.18,
      letterSpacing: '-.02em',
      color: 'var(--ink-0)'
    }
  }, "Grow Your Business", /*#__PURE__*/React.createElement("br", null), "with ", /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Custom Solutions")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: 'var(--ink-300)'
    }
  }, "We deliver innovative digital solutions."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Get Started"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 12,
      color: 'var(--ink-200)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "play",
    size: 11
  })), "Watch Video"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--grad-glass)',
      border: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    icon: "trending-up",
    style: {
      fontSize: 10
    }
  }, "+68% Growth"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 6,
      height: 92,
      marginTop: 12
    }
  }, bars.map((h, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: h + '%',
      borderRadius: '3px 3px 0 0',
      background: i > 4 ? 'var(--grad-gold)' : 'var(--grad-accent)',
      opacity: i > 4 ? 1 : .8
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 10
    }
  }, ['bar-chart-3', 'users', 'wallet', 'globe'].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 28,
      borderRadius: 7,
      background: 'rgba(255,255,255,.06)',
      border: '1px solid var(--border-hairline)',
      color: 'var(--ink-200)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n,
    size: 13
  })))))), /*#__PURE__*/React.createElement(LogoStrip, {
    names: ['Google', 'Microsoft', 'Slack', 'Dropbox']
  }));
}
function HomeScreen({
  onNavigate
}) {
  const [active, setActive] = React.useState(1);
  const services = [{
    icon: 'layout-dashboard',
    title: 'Website Design'
  }, {
    icon: 'trending-up',
    title: 'SEO & Growth'
  }, {
    icon: 'shopping-cart',
    title: 'E-Commerce'
  }, {
    icon: 'headset',
    title: '24/7 Support'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    style: {
      paddingBlock: 'var(--space-11) var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    kicker: "Professional",
    emphasis: "Business Website",
    title: "Design",
    sub: "Modern layout for startups and companies.",
    size: "display-1"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 940,
      width: '100%',
      marginInline: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ProductFrame, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--space-4)'
    }
  }, services.map((s, i) => /*#__PURE__*/React.createElement(FeatureCard, {
    key: s.title,
    icon: s.icon,
    title: s.title,
    skin: i === active ? 'emerald' : 'ivory',
    activeDot: i % 3,
    onClick: () => setActive(i)
  }))), /*#__PURE__*/React.createElement(StatBar, {
    stats: [{
      value: '500+',
      label: 'Projects'
    }, {
      value: '98%',
      label: 'Client Satisfaction'
    }, {
      value: '24/7',
      label: 'Support'
    }],
    cta: "Get Free Quote",
    onCtaClick: () => onNavigate('Contact')
  }), /*#__PURE__*/React.createElement(KeywordRail, {
    words: ['Modern', 'Fast', 'Secure', 'Scalable']
  }))), /*#__PURE__*/React.createElement(Section, {
    tight: true
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "How we work",
    emphasis: "A process",
    title: "built on proof",
    sub: "Four steps, fixed scope, weekly demos. You see the site before you sign off on it."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-9)'
    }
  }, [{
    n: '01',
    t: 'Discovery',
    b: 'One workshop to agree the audience, the offer and the proof.'
  }, {
    n: '02',
    t: 'Design',
    b: 'Two directions in week one, one refined direction in week two.'
  }, {
    n: '03',
    t: 'Build',
    b: 'Static, fast, accessible. Lighthouse 95+ before handover.'
  }, {
    n: '04',
    t: 'Growth',
    b: 'Search, analytics and a monthly report you will actually read.'
  }].map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.n,
    skin: "glass",
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 28,
      letterSpacing: '-.02em',
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h4)',
      color: 'var(--ink-0)'
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-body)'
    }
  }, s.b))))), /*#__PURE__*/React.createElement(Section, {
    tight: true
  }, /*#__PURE__*/React.createElement(Card, {
    skin: "emerald",
    padding: "var(--space-10)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 420px',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'var(--text-display-3)',
      lineHeight: 'var(--lh-display)',
      letterSpacing: 'var(--ls-display)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "Ready when"), " you are"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-lg)',
      color: 'var(--ink-100)',
      maxWidth: 480
    }
  }, "Tell us what you are launching. You will have a scoped proposal within two business days.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconAfter: "arrow-right",
    onClick: () => onNavigate('Contact')
  }, "Get Free Quote"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    icon: "calendar",
    onClick: () => onNavigate('Contact')
  }, "Book a Call"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(ProgressDots, {
    count: 3,
    active: 0
  }))));
}
Object.assign(MitecKit, {
  HomeScreen,
  ProductFrame
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/PortfolioScreen.jsx
try { (() => {
const MitecKit = window.MitecKit = window.MitecKit || {};
const {
  Card,
  Badge,
  Button,
  Icon,
  SectionHeading,
  Tabs,
  StatBlock,
  GlowRule,
  ProgressDots
} = window.MitecDesignSystem_43d123;
const {
  Section
} = window.MitecKit;
const WORK = [{
  cat: 'Commerce',
  client: 'Northbank Supply',
  line: 'Wholesale catalogue rebuilt around reorder speed.',
  metric: '+68%',
  metricLabel: 'Repeat orders',
  tone: 'emerald'
}, {
  cat: 'Web',
  client: 'Aldworth Legal',
  line: 'A practice site that reads like a referral.',
  metric: '3.1×',
  metricLabel: 'Enquiries',
  tone: 'ivory'
}, {
  cat: 'Growth',
  client: 'Meridian Health',
  line: 'Search architecture across 400 clinic pages.',
  metric: '+212%',
  metricLabel: 'Organic sessions',
  tone: 'glass'
}, {
  cat: 'Web',
  client: 'Fold Studio',
  line: 'Portfolio, journal and a booking flow in one.',
  metric: '0.9s',
  metricLabel: 'LCP',
  tone: 'glass'
}, {
  cat: 'Commerce',
  client: 'Tela Goods',
  line: 'Checkout reduced from five steps to two.',
  metric: '-41%',
  metricLabel: 'Cart abandonment',
  tone: 'ivory'
}, {
  cat: 'Growth',
  client: 'Pellamco',
  line: 'Reporting the board reads without a translator.',
  metric: '12',
  metricLabel: 'Markets live',
  tone: 'glass'
}];
function WorkCard({
  item
}) {
  const light = item.tone === 'ivory';
  return /*#__PURE__*/React.createElement(Card, {
    skin: item.tone,
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      minHeight: 230
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: light ? 'neutral' : 'accent'
  }, item.cat), /*#__PURE__*/React.createElement("span", {
    style: {
      color: light ? 'var(--ink-500)' : 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h3)',
      letterSpacing: 'var(--ls-heading)',
      color: light ? 'var(--ink-900)' : 'var(--ink-0)'
    }
  }, item.client), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--lh-body)',
      color: light ? 'var(--ink-500)' : 'var(--text-muted)'
    }
  }, item.line)), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 'var(--space-3)',
      borderTop: '1px solid ' + (light ? 'rgba(14,26,24,.1)' : 'var(--border-hairline)')
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    align: "left",
    value: item.metric,
    label: item.metricLabel,
    tone: light ? 'ink' : 'bronze'
  })));
}
function PortfolioScreen({
  onNavigate
}) {
  const [tab, setTab] = React.useState('All');
  const list = tab === 'All' ? WORK : WORK.filter(w => w.cat === tab);
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Selected work",
    emphasis: "Sites that",
    title: "paid for themselves",
    sub: "Six engagements from the last eighteen months, each with the number the client cared about."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginBlock: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: ['All', 'Web', 'Commerce', 'Growth'],
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-4)'
    }
  }, list.map(w => /*#__PURE__*/React.createElement(WorkCard, {
    key: w.client,
    item: w
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-9)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(GlowRule, {
    dots: true
  }), /*#__PURE__*/React.createElement(ProgressDots, {
    count: 3,
    active: 0
  }), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconAfter: "arrow-right",
    onClick: () => onNavigate('Contact')
  }, "Start a Project")));
}
Object.assign(MitecKit, {
  PortfolioScreen,
  WorkCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/PortfolioScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/ServicesScreen.jsx
try { (() => {
const MitecKit = window.MitecKit = window.MitecKit || {};
const {
  Card,
  Badge,
  Button,
  Icon,
  SectionHeading,
  Tabs,
  Breadcrumb,
  Alert,
  Tooltip,
  IconButton
} = window.MitecDesignSystem_43d123;
const {
  Section
} = window.MitecKit;
const CATALOGUE = [{
  cat: 'Web',
  icon: 'layout-dashboard',
  title: 'Website Design',
  price: 'from $9,500',
  body: 'Positioning, art direction and a full page system built to convert.',
  tags: ['Art direction', 'Design system', 'Copy support']
}, {
  cat: 'Growth',
  icon: 'trending-up',
  title: 'SEO & Growth',
  price: 'from $2,400/mo',
  body: 'Technical SEO, content architecture and a monthly performance report.',
  tags: ['Technical audit', 'Content plan', 'Reporting']
}, {
  cat: 'Commerce',
  icon: 'shopping-cart',
  title: 'E-Commerce',
  price: 'from $14,000',
  body: 'Catalogue, checkout and merchandising tuned for average order value.',
  tags: ['Checkout', 'Merchandising', 'Payments']
}, {
  cat: 'Web',
  icon: 'shield-check',
  title: 'Care & Security',
  price: 'from $600/mo',
  body: 'Patching, backups, uptime monitoring and a 4-hour response window.',
  tags: ['Monitoring', 'Backups', 'Patching']
}, {
  cat: 'Growth',
  icon: 'bar-chart-3',
  title: 'Analytics',
  price: 'from $3,200',
  body: 'Event design, dashboards and the definitions your team agrees on.',
  tags: ['Tracking plan', 'Dashboards']
}, {
  cat: 'Commerce',
  icon: 'headset',
  title: '24/7 Support',
  price: 'included',
  body: 'A named engineer, a shared channel and no ticket queue.',
  tags: ['Named contact', 'Shared channel']
}];
function ServicesScreen({
  onNavigate
}) {
  const [tab, setTab] = React.useState('All');
  const list = tab === 'All' ? CATALOGUE : CATALOGUE.filter(s => s.cat === tab);
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: ['Home', 'Services'],
    onNavigate: onNavigate
  })), /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    eyebrow: "Services",
    emphasis: "Everything",
    title: "a growing site needs",
    sub: "Six engagements. Fixed scope, published pricing, no discovery fee.",
    size: "display-2"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      marginBlock: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    items: ['All', 'Web', 'Growth', 'Commerce'],
    active: tab,
    onChange: setTab
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, list.length, " of ", CATALOGUE.length, " engagements"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Download the rate card"
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "download",
    label: "Download rate card"
  })), /*#__PURE__*/React.createElement(Tooltip, {
    label: "Share this page"
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "share-2",
    label: "Share"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-4)'
    }
  }, list.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.title,
    skin: "glass",
    interactive: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--grad-accent)',
      color: '#fff',
      boxShadow: 'var(--glow-sm)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 20
  })), /*#__PURE__*/React.createElement(Badge, {
    tone: "bronze"
  }, s.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h3)',
      color: 'var(--ink-0)',
      letterSpacing: 'var(--ls-heading)'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-body)'
    }
  }, s.body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, s.tags.map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t,
    tone: "neutral"
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      paddingTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    iconAfter: "arrow-right",
    onClick: () => onNavigate('Contact')
  }, "Scope it"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)',
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Retainers start on the first of the month"
  }, "Scoping calls booked before the 25th secure that month's start date.")));
}
Object.assign(MitecKit, {
  ServicesScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/ServicesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Shell.jsx
try { (() => {
const MitecKit = window.MitecKit = window.MitecKit || {};
const {
  NavBar,
  Logo,
  Icon,
  GlowRule,
  Button
} = window.MitecDesignSystem_43d123;

/** Ambient page ground: navy base, off-centre emerald bloom, faint mesh lines. */
function Ground({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      minHeight: '100%',
      background: 'var(--grad-page)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(52% 40% at 18% 26%, rgba(44,196,134,.22), transparent 68%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: .5,
      backgroundImage: 'var(--grad-mesh-line)',
      backgroundSize: '64px 100%',
      maskImage: 'linear-gradient(180deg,transparent,rgba(0,0,0,.5) 40%,transparent)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, children));
}
function Container({
  children,
  narrow = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: narrow ? 'var(--container-narrow)' : 'var(--container-max)',
      marginInline: 'auto',
      paddingInline: 'var(--space-6)',
      ...style
    }
  }, children);
}
function Section({
  children,
  tight = false,
  style
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      paddingBlock: tight ? 'var(--space-10)' : 'var(--section-y)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(Container, null, children));
}
function Footer({
  onNavigate
}) {
  const cols = [{
    head: 'Services',
    links: ['Website Design', 'SEO & Growth', 'E-Commerce', '24/7 Support']
  }, {
    head: 'Company',
    links: ['About', 'Portfolio', 'Careers', 'Contact']
  }, {
    head: 'Resources',
    links: ['Process', 'Pricing', 'Journal', 'Support']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border-hairline)',
      background: 'var(--grad-band)',
      paddingBlock: 'var(--space-10) var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr repeat(3, 1fr)',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 26
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--lh-body)'
    }
  }, "We design and build business websites that earn trust in the first three seconds."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      color: 'var(--text-muted)'
    }
  }, ['linkedin', 'github', 'twitter', 'dribbble'].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      borderRadius: '50%',
      border: '1px solid var(--border-hairline)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n,
    size: 16
  }))))), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.head,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 800,
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--text-heading)'
    }
  }, c.head), c.links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => onNavigate && onNavigate('Services'),
    style: {
      background: 'none',
      border: 'none',
      padding: 0,
      textAlign: 'left',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBlock: 'var(--space-8) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(GlowRule, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      flexWrap: 'wrap',
      fontSize: 'var(--text-caption)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 mitec.team \u2014 All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Accessibility")))));
}
Object.assign(MitecKit, {
  Ground,
  Container,
  Section,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.GlowRule = __ds_scope.GlowRule;

__ds_ns.KeywordRail = __ds_scope.KeywordRail;

__ds_ns.LogoStrip = __ds_scope.LogoStrip;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StatBar = __ds_scope.StatBar;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.ProgressDots = __ds_scope.ProgressDots;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
