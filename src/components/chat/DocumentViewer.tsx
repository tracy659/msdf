import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Image, File, Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DocumentViewerProps {
  files: File[];
  onRemove: (index: number) => void;
}

interface FilePreviewProps {
  file: File;
  onView: () => void;
  onRemove: () => void;
}

function FilePreviewCard({ file, onView, onRemove }: FilePreviewProps) {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);

  // Generate preview for images
  useState(() => {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  });

  const getFileIcon = () => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type === 'application/pdf') return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const FileIcon = getFileIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Preview Area */}
      <div 
        className="relative h-32 bg-muted/50 cursor-pointer overflow-hidden"
        onClick={onView}
      >
        {preview ? (
          <img 
            src={preview} 
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" className="h-8 px-3">
            <Maximize2 className="w-4 h-4 mr-1" />
            {language === 'ar' ? 'عرض' : 'View'}
          </Button>
        </div>

        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
        >
          <X className="w-3 h-3" />
        </button>

        {/* File Type Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full uppercase">
          {file.type.split('/')[1]?.substring(0, 4) || 'file'}
        </div>
      </div>

      {/* File Info */}
      <div className="p-3">
        <p className="font-medium text-sm truncate text-foreground" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatFileSize(file.size)}
        </p>
      </div>
    </motion.div>
  );
}

export function DocumentViewer({ files, onRemove }: DocumentViewerProps) {
  const { language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(100);

  const getPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <>
      {/* Document Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <AnimatePresence>
          {files.map((file, index) => (
            <FilePreviewCard
              key={`${file.name}-${index}`}
              file={file}
              onView={() => setSelectedFile(file)}
              onRemove={() => onRemove(index)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Full View Modal */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedFile?.type.startsWith('image/') ? (
                  <Image className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
                <DialogTitle className="truncate max-w-[300px]">
                  {selectedFile?.name}
                </DialogTitle>
              </div>
              
              {/* Zoom Controls for Images */}
              {selectedFile?.type.startsWith('image/') && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setZoom(Math.max(25, zoom - 25))}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground w-12 text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto bg-muted/30 flex items-center justify-center p-4">
            {selectedFile && (
              <>
                {selectedFile.type.startsWith('image/') ? (
                  <motion.img
                    key={zoom}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    src={getPreviewUrl(selectedFile)}
                    alt={selectedFile.name}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                ) : selectedFile.type === 'application/pdf' ? (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar' 
                        ? 'معاينة PDF غير متاحة في المتصفح'
                        : 'PDF preview not available in browser'}
                    </p>
                    <Button
                      onClick={() => {
                        const url = getPreviewUrl(selectedFile);
                        window.open(url, '_blank');
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {language === 'ar' ? 'فتح PDF' : 'Open PDF'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                      <File className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'معاينة غير متاحة' : 'Preview not available'}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with File Info */}
          {selectedFile && (
            <div className="px-6 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {language === 'ar' ? 'النوع:' : 'Type:'} {selectedFile.type || 'Unknown'}
              </span>
              <span className="text-muted-foreground">
                {language === 'ar' ? 'الحجم:' : 'Size:'} {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
