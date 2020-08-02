export class ImagePaste {
  //quill 和 options->方便定义一些配置
  constructor(quill, options = {}) {
    // save the quill
    this.quill = quill;
    //绑定事件
    this.handlePaste = this.handlePaste.bind(this);
    // 坚挺粘贴事件
    this.quill.root.addEventListener("paste", this.handlePaste, false);
  }

  //处理粘贴事件
  //还需要根据复制的数据类型作一下判断
  //读取到剪贴板中的数据 具体的参考使用 可以看下MDN的文档 基本主流的浏览器都支持了
  handlePaste(e) {
    if (
      e.clipboardData &&
      e.clipboardData.items &&
      e.clipboardData.items.length
    ) {
      const clipboardData = e.clipboardData;
      const items = clipboardData.items;
      const item = items[0];
      if (item && item.kind === "file" && item.type.match(/^image\//i)) {
        //阻止默认事件,防止粘贴两次图片
        e.preventDefault()
        this.file = item.getAsFile();
        this.toBase64();
      }
    }
  }

  toBase64() {
    // 转换成base64 也可以压缩图片进行上传
    const reader = new FileReader();
    reader.onload = e => {
      this.insertImg(e.target.result);
    };
    reader.readAsDataURL(this.file);
  }

  insertImg(baseUrl) {
    // 插入文本中
    const currentIndex = this.quill.getSelection().index || 0;
    this.quill.insertEmbed(currentIndex, "image", baseUrl);
    this.quill.setSelection(currentIndex + 1);
    this.quill.update();
    // 更新光标的位置
  }
}