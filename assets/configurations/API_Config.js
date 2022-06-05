const APIs = {
  // Common configurations
  channel: 'CMS',
  responses: {
    OK: {
      code: 0,
      message: 'OK',
    },
    TOKEN_INVALID: {
      code: 1,
      message: 'Token không hợp lệ',
    },
    TOKEN_EXPIRE: {
      code: 2,
      message: 'Token đã hết hạn',
    },
    '-1': {
      name: 'UNKNOWN_ERROR',
      message: 'Lỗi không xác định',
    },
    0: {
      name: 'SUCCESS',
      message: 'Thành công',
    },
    1: {
      name: 'TOKEN_INVALID',
      message: 'Token không hợp lệ',
    },
    2: {
      name: 'TOKEN_EXPIRE',
      message: 'Token đã hết hạn',
    },
    3: {
      name: 'REQUEST_INVALID',
      message: 'Yêu cầu không hợp lệ',
    },
    4: {
      name: 'NO_DATA_TO_EXPORT',
      message: 'Không có dữ liệu để xuất file',
    },
    5: {
      name: 'UNKNOWN_ERROR',
      message: 'Lỗi không xác định',
    },
    99: {
      name: 'UNKNOWN',
      message: 'Lỗi không xác định',
    },
    999: {
      name: 'UNKNOWN',
      message: 'Lỗi không xác định',
    },
    1002: {
      name: 'USER_OR_PASS_INCORECT',
      message: 'Tài khoản hoặc mật khẩu không đúng',
    },
    1003: {
      name: 'ACCOUNT_NOT_ACTIVE',
      message: 'Tài khoản chưa được kích hoạt',
    },
    1004: {
      name: 'ACCOUNT_IS_LOCKED',
      message: 'Tài khoản đã bị khóa',
    },
    1005: {
      name: 'EMAIL_EXIST',
      message: 'Email đã tồn tại',
    },
    1006: {
      name: 'EMAIL_NOT_EXIST',
      message: 'Email không tồn tại',
    },
    1007: {
      name: 'OTP_NOT_EXIST',
      message: 'OTP không tồn tại',
    },
    1008: {
      name: 'OTP_IS_USED',
      message: 'OTP đã được sử dụng',
    },
    1009: {
      name: 'OTP_IS_EXPIRED',
      message: 'OTP đã hết hạn',
    },
    1010: {
      name: 'USER_NOT_EXISTS',
      message: 'Tài khoản không tồn tại',
    },
    1011: {
      name: 'PASSWORD_NOT_CORRECT',
      message: 'Tài khoản hoặc mật khẩu không đúng',
    },
    1012: {
      name: 'NOT_ADMIN_ACCOUNT',
      message: 'Tài khoản của bạn không phải tài khoản quản trị',
    },
    1013: {
      name: 'CATEGORY_LANG_EXIST',
      message: 'Danh mục đã tồn tại',
    },
    1014: {
      name: 'CATEGORY_TITLE_EXIST',
      message: 'Tên danh mục đã tồn tại',
    },
    1015: {
      name: 'CATEGORY_URL_SEO_EXIST',
      message: 'URL SEO trong danh mục đã tồn tại',
    },
    1016: {
      name: 'LANGUAGE_DEFAULT_NOT_EXIST',
      message: 'Ngôn ngữ mặc định không được cấu hình',
    },
    1017: {
      name: 'RESOURCE_IS_DELETED',
      message: 'Tài nguyên đã bị xóa',
    },
    1018: {
      name: 'RESOURCE_NOT_FOUND',
      message: 'Không tìm thấy tài nguyên',
    },
    1019: {
      name: 'DATA_INVALID',
      message: 'Dữ liệu không hợp lệ',
    },
    1020: {
      name: 'COMING_SOON',
      message: 'COMING SOON',
    },
    1021: {
      name: 'RESOURCE_IS_DISABLE',
      message: 'Tài nguyên đã bị vô hiệu hóa',
    },
    1022: {
      name: 'ROOM_NOT_EXIST',
      message: 'Phòng không tồn tại',
    },
    1023: {
      name: 'CURRENCY_CONVERT_NOT_FOUND',
      message: 'Tỷ giá tiền tệ không tồn tại',
    },
    1024: {
      name: 'TOUR_NOT_EXIST',
      message: 'Tour không tồn tại',
    },
    1025: {
      name: 'CAN_NOT_DELETE_SYSTEM_RESOURCE',
      message: 'Không thể xóa tài nguyên hệ thống',
    },
    1026: {
      name: 'URL_SEO_IS_EXISTED',
      message: 'URL SEO đã tồn tại',
    },
    1031: {
      name: 'REST_ROOM_NOT_AVAILABLE',
      message: 'Đã hết phòng trống',
    },
    1032: {
      name: 'PRODUCT_NOT_EXIST',
      message: 'Sản phẩm không tồn tại',
    },
    1033: {
      name: 'BUSINESS_REGISTRATION_CODE_EXISTED',
      message: 'Mã số đăng ký kinh doanh đã tồn tại',
    },
    1042: {
      name: 'ATTRIBUTE_NAME_EXISTED',
      message: 'Tên thuộc tính này đã tồn tại',
    },
    1043: {
      name: 'ATTRIBUTE_SET_NAME_EXISTED',
      message: 'Tên bộ thuộc tính này đã tồn tại',
    },
    1044: {
      name: 'EXCEED_MAXIUM_LEVEL',
      message: 'Vượt quá cấp độ tối đa',
    },
    42000: {
      name: 'URL_SEO_IS_EXISTED',
      message: 'URL SEO đã tồn tại',
    },
  },

  // APIs
  login: {
    url: 'cms/admin/login',
    method: 'POST',
    responses: {
      CREDENTIALS_INVALID: {
        code: 1001,
        message: 'Tên người dùng hoặc mật khẩu không hợp lệ',
      },
    },
  },
  // http://222.252.16.140:10000/api/cms/account/get_role_by_user?transid=xxx&channel=cms
  getRoleByUser: {
    url: '/account/get_role_by_user',
    method: 'GET',
    responses: {},
  },
  // END UsersAPI
  getListGroupUsers: {
    url: '/group/get_list',
    method: 'GET',
    responses: {},
  },
  getListUsers: {
    url: '/account/get_list',
    method: 'GET',
  },
  getUser: {
    url: '/account/get_detail',
    method: 'GET',
  },
  updateUser: {
    url: '/account/update',
    method: 'POST',
  },
  addUser: {
    url: '/account/add',
    method: 'POST',
    responses: {
      ACCOUNT_EXIST: {
        code: 101,
        message: 'Tài khoản đã tồn tại',
      },
    },
  },
  resetUserPass: {
    url: '/account/reset_pass',
    method: 'POST',
    responses: {},
  },
  changePass: {
    url: '/account/change_password',
    method: 'POST',
  },
  deleteUser: {
    url: '/account/delete',
    method: 'POST',
    responses: {},
  },
  getListPages: {
    url: '/page/get_list',
    method: 'GET',
    responses: {},
  },
  getGroupUser: {
    url: '/group/get_detail',
    method: 'GET',
    responses: {},
  },
  deleteGroupUser: {
    url: '/group/delete',
    method: 'POST',
    responses: {},
  },
  updateGroupUser: {
    url: '/group/update',
    method: 'POST',
    responses: {},
  },
  addGroupUser: {
    url: '/group/add_user',
    method: 'POST',
    responses: {},
  },
  checkDeleteGroupUser: {
    url: '/group/check_group_id',
    method: 'GET',
    responses: {},
  },
}

export default APIs
