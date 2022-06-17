export const makeSlug = (name) => {
    let slug = "";
    //Đổi chữ hoa thành chữ thường
    slug = name.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\\`|\\~|\\!|\\@|\\#|\||\$|\\%|\^|\\&|\*|\(|\)|\+|\\=|\\,|\.|\/|\?|\\>|\\<|\\'|\\"|\\:|\\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "_");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\\-\\-\\-\\-\\-/gi, '_');
    slug = slug.replace(/\\-\\-\\-\\-/gi, '_');
    slug = slug.replace(/\\-\\-\\-/gi, '_');
    slug = slug.replace(/\\-\\-/gi, '_');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\\@\\-|\\-\\@|\\@/gi, '');
    //In slug ra textbox có id “slug”
    return slug;
}

export const removeVNE = (str) => {
    let text = "";
    //Đổi chữ hoa thành chữ thường
    text = str.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    text = text.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    text = text.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    text = text.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    text = text.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    text = text.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    text = text.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    text = text.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    text = text.replace(/\\`|\\~|\\!|\\@|\\#|\||\$|\\%|\^|\\&|\*|\(|\)|\+|\\=|\\,|\.|\/|\?|\\>|\\<|\\'|\\"|\\:|\\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    text = text.replace(/ /gi, "_");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    text = text.replace(/\\-\\-\\-\\-\\-/gi, '_');
    text = text.replace(/\\-\\-\\-\\-/gi, '_');
    text = text.replace(/\\-\\-\\-/gi, '_');
    text = text.replace(/\\-\\-/gi, '_');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    text = '@' + text + '@';
    text = text.replace(/\\@\\-|\\-\\@|\\@/gi, '');
    //In text ra textbox có id “text”
    text = text.replace(/[^0-9a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\s]/gi, '');
    return text;
}

