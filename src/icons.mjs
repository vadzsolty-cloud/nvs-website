const drawings={
 wrench:'<path d="M14 6a5 5 0 0 0-6 6L2 18a2.8 2.8 0 0 0 4 4l6-6a5 5 0 0 0 6-6l-3 3-4-4 3-3Z"/>',
 user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h3m3 0h2"/>',
 phone:'<path d="m5 3 4 1 1 5-3 2a16 16 0 0 0 6 6l2-3 5 1 1 4c-1 4-7 2-11-1S1 7 5 3Z"/>',
 pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4M7 10l3 3 7-6"/>',
 android:'<path d="m7 6-2-3m12 3 2-3M5 11a7 7 0 0 1 14 0v7H5Zm-2 1v5m18-5v5M8 18v3m8-3v3"/><path d="M9 9h.01M15 9h.01"/>',
 check:'<path d="m5 12 4 4L19 6"/>',shield:'<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
 target:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
 car:'<path d="m5 10 2-6h10l2 6M3 10h18v8H3Zm2 8v3m14-3v3M6 14h2m8 0h2"/>',
 diagnostic:'<rect x="3" y="3" width="18" height="15" rx="2"/><path d="M8 22h8m-4-4v4M6 11h3l2-4 3 8 2-4h2"/>',
 wheel:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="m12 3 0 6m8 7-5-3m-11 3 5-3M6 5l4 5m8-5-4 5m-2 5v6"/>',
 suspension:'<path d="M8 2h8m-4 0v3m-5 1 10 3-10 3 10 3-10 3m5 1v3m-4 0h8"/>',
 brake:'<circle cx="11" cy="12" r="8"/><circle cx="11" cy="12" r="2"/><path d="M16 4h5v10h-4M7 8h.01M7 16h.01M14 7h.01M14 17h.01"/>',
 headlight:'<path d="M12 5v14c6 0 9-3 9-7s-3-7-9-7ZM2 6h6M1 10h7m-7 4h7m-6 4h6"/>'
};
export const uiIcon=name=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${drawings[name]||drawings.arrow}</svg>`;
