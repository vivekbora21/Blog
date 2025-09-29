# TODO: Implement Token Storage in Cookies and Logout Functionality

## Steps to Complete
- [x] Create `src/utils/auth.js` with cookie utility functions (setCookie, getCookie, deleteCookie).
- [x] Update `src/components/LoginForm.jsx` to use `setCookie` instead of `localStorage.setItem`.
- [x] Update `src/components/navbar.jsx` to use `getCookie` and implement `handleLogout` function for logout button.
- [x] Update `src/components/AddBlog.jsx` to use `getCookie` instead of `localStorage.getItem`.
- [x] Check and update `src/components/MyBlogs.jsx` for token retrieval if needed.
- [x] Check and update `src/components/dashboard.jsx` for token retrieval if needed.
- [x] Add auth checks in `src/App.jsx` for protected routes to redirect if no token.
- [ ] Test login, logout, and API calls to ensure cookies work correctly.
