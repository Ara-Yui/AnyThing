import { AppConfig } from '../AppConfig'
interface FileDialogConfig {
  accept?: string | string[];
  multiple?: boolean;
  webkitdirectory?: boolean;
  compatible?: boolean;
  cancel?: number;
  description?: string;
}
/**
 * 文件助手类
 * @author Hamm
 */
export abstract class AnyFileHelper {

  /**
 * 打开文件选择对话框
 * 若浏览器不支持实验性方法：window.showOpenFilePicker，则采用input[type=file]元素进行兼容
 * @param {string | string[]} accept 文件类型限制 ，默认全部
 * @param {boolean} multiple 文件多选
 * @param {boolean} webkitdirectory 只选择目录限制
 * @param {number} compatible 兼容模式，默认开启
 * @param {number} cancel 兼容取消控制，为0时候则取消文件时不抛出reject，❗在使用async/await时会造成阻塞
 * @param {string} description 文件或者文件夹的描述，可选
 * @return {Promise<FileList>}
 */
 static async openFileDialog(
  {
    accept = MIME.ALL,
    compatible = true,
    cancel = 300,
    multiple,
    webkitdirectory,
    description
  }: FileDialogConfig = {}
): Promise<File[]> {
  accept.constructor === Array && (accept = accept.join(","));
  // 实验性功能
  if (!compatible && window.hasOwnProperty("showOpenFilePicker")) {
    console.warn("请注意，showOpenFilePicker是一个实验性接口，大多数浏览器不支持它，所以请谨慎使用。\n Please note that showOpenFilePicker is an experimental interface that is not supported by most browsers, so use it with caution.");
    const files = [];
    const acceptMap: { [accept: string]: string[] } = {};
    for (let a of (accept as string).split(",")) {
      acceptMap[a] = [];
    }
    //@ts-ignore
    const fileHandleList = await window.showOpenFilePicker?.({
      multiple,
      excludeAcceptAllOption: false,
      types: [{
        description,
        accept: acceptMap
      }]
    });
    for (const f of fileHandleList) {
      files.push(await f.getFile());
    }
    return files;
  }

  const inpEle = document.createElement("input");
  inpEle.id = `__file_${Math.trunc(Math.random() * 100000)}`;
  inpEle.type = "file";
  inpEle.style.display = "none";
  // 文件类型限制
  inpEle.accept = accept as string;
  // 多选限制
  multiple && (inpEle.multiple = multiple);
  // 选择目录限制
  if (webkitdirectory) {
    console.warn("该特性是非标准的，请尽量不要在生产环境中使用它！\n"
                 + "This feature is non-standard, so try not to use it in a production environment!");
    inpEle.webkitdirectory = webkitdirectory;
  }
  inpEle.click();

  return await new Promise((resolve, reject) => {
    let _isSelected = false;
    const changeEvent = () => {
      const files = inpEle.files;
      if (files) {
        _isSelected = true;
        resolve(Array.from(files));
      }
    };
    const focusEvent = (event: Event) => {
      if (event.target?.constructor === Window) {
        setTimeout(() => {
          !_isSelected && reject("未选定文件\nUnselected file");
        }, cancel);
      }
    };
    inpEle.addEventListener("change", changeEvent, {once: true});
    cancel && window.addEventListener("focus", focusEvent, {once: true});
  });
}


  /**
   * 以文本形式读取文件（二进制文件除外）
   * @param file 文件
   * @returns 文件内容
   * @throws {Error} 文件读取失败
   * @throws {Error} 文件类型不支持
   * @throws {Error} 文件大小超过限制
   * @throws {Error} 文件为空
   */
  static async readFileAsText(file: File): Promise<string> {
    if (!file) {
      throw new Error('文件为空')
    }
    if (file.size > AppConfig.maxFileSize) {
      throw new Error('文件大小超过限制')
    }
    // 二进制文件不支持
    if (file.type.includes('image') || file.type.includes('audio') || file.type.includes('video')) {
      throw new Error('文件类型不支持')
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.onerror = (e) => {
        reject(e)
      }
      reader.readAsText(file)
    })
  }

  /**
   * 字节数转可读文件大小
   * @param size 字节数
   * @param fractionDigits 小数位数
   * @returns
   */
  static getFileSizeFriendly(size: number, fractionDigits = 2): string {
    const partSize = 1024
    const unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let res = ''
    for (let i = 0; i < unitArr.length; i += 1) {
      if (size < partSize ** (i + 1)) {
        res = `${(size / (partSize ** i)).toFixed(fractionDigits)}${unitArr[i]}`
        break
      }
      res = 'LARGE FILE'
    }
    return res
  }

  /**
   * 获取静态文件的绝对地址
   * @param url 地址
   * @returns 绝对地址
   */
  static getStaticFileUrl(url: string): string {
    if (!url) {
      return ''
    }
    if (url.includes('https://') || url.includes('http://')) {
      return url
    }
    return AppConfig.staticUrl + url
  }
}