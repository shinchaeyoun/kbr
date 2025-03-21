<>
  <Route path="/" element={<PrivateEnterRoute />} />
  {/* <Route path="/" element={<Main isLogin={isLogin} isTrue={isLogin} />} /> */}
  <Route path="/" element={<BoardList level={level} />} />
  <Route path="/sendtest" element={<SendTest />} />
  <Route
    path="/login"
    element={<Login isLogin={isLogin} onSignupClick={moveToSignup} />}
  />
  <Route path="/signup" element={<Signup />} />
  <Route path="/board" element={<BoardList level={level} />} />
  <Route path="/write" element={<BoardWrite />} />
  <Route path="/board/:idx" element={<BoardDetail />} />
  <Route path="/update/:idx" element={<BoardUpdate />} />
  <Route path="/userinfo" element={<UserInfo />} />

  <Route
    path="/public"
    element={<PrivatePublicRoute level={level} component={<Public />} />}
  />
  <Route
    path="/master"
    element={<PrivateMasterRoute level={level} component={<Master />} />}
  />

  <Route
    path="/admin"
    element={<PrivateAdminRoute level={level} component={<Admin />} />}
  />
</>;
