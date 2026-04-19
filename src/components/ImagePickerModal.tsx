import React, { useState } from 'react';
import { Modal, Upload, Button, Tabs, message } from 'antd';
import { CameraOutlined, LinkOutlined, UploadOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { clsx } from 'clsx';
import './ImagePickerModal.css';

const { Dragger } = Upload;

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (content: string, imageUrl: string) => void;
  isPosting?: boolean;
}

export default function ImagePickerModal({ isOpen, onClose, onPost, isPosting }: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState('upload');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload: UploadProps['onChange'] = (info) => {
    const { status } = info.file;
    if (status === 'done' || status === 'uploading') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      if (info.file.originFileObj) {
        reader.readAsDataURL(info.file.originFileObj);
      }
    }
  };

  const handleSubmit = () => {
    const finalUrl = activeTab === 'url' ? imageUrl : preview;
    onPost(content, finalUrl || '');
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined className="text-slate-500 hover:text-white transition-colors" />}
      className="premium-image-modal"
      centered
      width={700}
    >
      <div className="p-8 bg-[#0D1117] rounded-[2rem] overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-3xl font-black text-blue-500 italic uppercase tracking-tighter">
            Add Image to Post<span className="text-white">.</span>
          </h3>
        </div>

        {/* Text Content (Nomro) */}
        <div className="mb-8">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Broadcast your signal..."
            className="w-full h-24 bg-transparent text-4xl font-black text-white placeholder:text-slate-800 outline-none resize-none italic tracking-tighter leading-tight"
          />
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
              activeTab === 'upload' 
                ? "bg-slate-900/50 text-white border-white/10 shadow-[0_10px_30px_rgba(37,99,235,0.1)]" 
                : "text-slate-500 border-transparent hover:text-slate-300"
            )}
          >
            <UploadOutlined /> Upload
          </button>
          <button
            onClick={() => setActiveTab('url')}
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all border",
              activeTab === 'url' 
                ? "bg-slate-900/50 text-white border-white/10 shadow-[0_10px_30px_rgba(37,99,235,0.1)]" 
                : "text-slate-500 border-transparent hover:text-slate-300"
            )}
          >
            <LinkOutlined /> By URL
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[300px]">
          {activeTab === 'upload' ? (
            <div className="relative">
              {preview ? (
                <div className="relative rounded-3xl overflow-hidden group/preview border border-white/5 bg-slate-900/40">
                  <img src={preview} alt="Preview" className="w-full h-auto max-h-[240px] object-contain p-4 group-hover/preview:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="text" 
                      icon={<CloseOutlined />} 
                      onClick={() => setPreview(null)}
                      className="text-white hover:text-red-500"
                    />
                  </div>
                </div>
              ) : (
                <Dragger
                  multiple={false}
                  onChange={handleUpload}
                  showUploadList={false}
                  className="premium-dragger"
                >
                  <div className="py-12 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 border border-blue-500/20">
                      <CameraOutlined style={{ fontSize: '32px' }} />
                    </div>
                    <p className="text-xl font-bold text-white mb-2 italic">Drag & drop your image here</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">SVG, PNG, JPG OR GIF (MAX. 5MB)</p>
                    <div className="px-8 py-3 bg-slate-900 border border-white/5 rounded-2xl text-[11px] font-black text-blue-500 hover:text-white hover:bg-blue-600 transition-all uppercase tracking-widest cursor-pointer">
                      Browse Files
                    </div>
                  </div>
                </Dragger>
              )}
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                <LinkOutlined style={{ fontSize: '32px' }} />
              </div>
              <div className="w-full">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="Insert asset URL (Visual/Continuity)"
                  className="w-full px-8 py-5 bg-slate-900 border border-white/5 rounded-2xl outline-none text-white font-bold placeholder:text-slate-800 focus:border-blue-500/30 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-end gap-8 bg-white/2 p-6 rounded-3xl">
          <button 
            onClick={onClose}
            className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isPosting || (!content.trim() && !preview && !imageUrl)}
            className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white hover:text-slate-900 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] disabled:opacity-20 active:scale-95"
          >
             {isPosting ? 'POSTING...' : <><CheckOutlined /> Apply Image</>}
          </button>
        </div>
      </div>
    </Modal>
  );
}
