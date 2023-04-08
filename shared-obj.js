const Rule = () => ({ a: 'b', c: [{d: 'e', e: 'f'}]]});


const d = { type: 'default', rule: Rule() };
const e = { type: 'inherited', rule: Rule() };
const f = { type: 'default' };


const getRule = (rule) => d.type === 'default' ? null : d.rule;

console.log('funUtils has fast properties:', %HasFastProperties(funState));
