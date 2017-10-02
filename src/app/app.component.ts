import { Component, OnInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  private canvas: any;
  private isRedoing: boolean;
  private canvasHistory: any[];
  get drawingMode(): boolean { return this.canvas.isDrawingMode; }
  set drawingMode(val: boolean) { this.canvas.isDrawingMode = val; }

  public resultImage: any;

  constructor() {
    this.isRedoing = false;
    this.canvasHistory = [];
    this.resultImage = null;
  }

  ngOnInit() {
    // canvasオブジェクトの作成
    this.canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
      selection: true,
      stateful: true
    });

    // canvasオブジェクトにブラシをセットアップ
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = 'red';
    this.canvas.freeDrawingBrush.width = 5;
    this.canvas.freeDrawingBrush.shadowBlur = 0;
    this.canvas.hoverCursor = 'move';

    // 新しいオブジェクトが追加されたかを監視
    this.canvas.on('object:added', (e) => {
      const object = e.target;
      if (!this.isRedoing) {
        this.canvasHistory = [];
      }
      this.isRedoing = false;
    });
  }

  // 画像保存
  saveImage() {
    this.resultImage = this.canvas.toDataURL(
      { format: 'png' }
    );
  }

  // 戻る
  undo() {
    if (this.canvas._objects.length > 0) {
      const undoObject = this.canvas._objects.pop();
      this.canvasHistory.push(undoObject);
      this.canvas.renderAll();
    }
  }

  // 進む
  redo() {
    if (this.canvasHistory.length > 0) {
      this.isRedoing = true;
      const redoObject = this.canvasHistory.pop();
      this.canvas.add(redoObject);
    }
  }

  // 選択中のオブジェクトを削除
  deleteObject() {
    this.canvas.getActiveObject().remove();
   }
}
