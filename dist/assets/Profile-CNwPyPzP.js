import{h as g,j as o,i as e}from"./index-C956-tg9.js";import{u as m,b}from"./vendor-CctMCbJe.js";const L=()=>{const{user:i,isAuthenticated:a,isLoading:t,logout:h}=g(),n=m();b.useEffect(()=>{!t&&!a&&n("/")},[a,t,n]);const f=()=>{h(),n("/")};return t?o.jsx(c,{children:o.jsx("h2",{children:"Loading profile..."})}):i?o.jsx(c,{children:o.jsxs(j,{children:[o.jsx("h1",{children:"My Profile"}),o.jsxs(x,{children:[o.jsx("h2",{children:"Personal Information"}),o.jsxs(s,{children:[o.jsx(d,{children:"Name:"}),o.jsx(l,{children:i.name})]}),o.jsxs(s,{children:[o.jsx(d,{children:"Email:"}),o.jsx(l,{children:i.email})]}),i.phone&&o.jsxs(s,{children:[o.jsx(d,{children:"Phone:"}),o.jsx(l,{children:i.phone})]})]}),i.addresses&&i.addresses.length>0&&o.jsxs(x,{children:[o.jsx("h2",{children:"Addresses"}),i.addresses.map((r,u)=>o.jsxs(v,{isDefault:r.isDefault,children:[r.isDefault&&o.jsx(w,{children:"Default"}),o.jsx("p",{children:r.street}),o.jsxs("p",{children:[r.city,", ",r.state," ",r.zipCode]})]},r.id||u))]}),o.jsxs(k,{children:[o.jsx(D,{onClick:()=>alert("Edit profile functionality coming soon!"),children:"Edit Profile"}),o.jsx(E,{onClick:f,children:"Logout"})]})]})}):null},c=e.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`,j=e.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 32px;
  
  h1 {
    color: #0F5132;
    margin-top: 0;
    margin-bottom: 24px;
    font-size: 28px;
  }
`,x=e.div`
  margin-bottom: 30px;
  
  h2 {
    color: #0F5132;
    font-size: 20px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }
`,s=e.div`
  display: flex;
  margin-bottom: 12px;
`,d=e.div`
  font-weight: 600;
  width: 120px;
  color: #333;
`,l=e.div`
  flex: 1;
`,v=e.div`
  background-color: ${i=>i.isDefault?"#f0f7f3":"#f9f9f9"};
  border: 1px solid ${i=>i.isDefault?"#c1e0d0":"#e0e0e0"};
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
  position: relative;
  
  p {
    margin: 4px 0;
  }
`,w=e.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #0F5132;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
`,k=e.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`,p=e.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`,D=e(p)`
  background-color: #0F5132;
  color: white;
  border: none;
  
  &:hover {
    background-color: #0a3f27;
  }
`,E=e(p)`
  background-color: white;
  color: #d32f2f;
  border: 1px solid #d32f2f;
  
  &:hover {
    background-color: #d32f2f;
    color: white;
  }
`;export{L as default};
