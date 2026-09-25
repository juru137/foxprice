'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, Trash2, Check, AlertCircle, 
  UploadCloud, Sparkles, Layers, DollarSign, Package
} from 'lucide-react';
import { ProductCreateInputSchema, ProductVariantInputSchema } from '@/lib/zod-schemas';
import { z } from 'zod';

interface VariantDraft {
  id: string;
  title: string;
  sku: string;
  price: string;
  inventoryCount: string;
  attributeKey: string;
  attributeVal: string;
}

export default function NewProductAdminPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat_hardware');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [costPerItem, setCostPerItem] = useState('');
  const [sku, setSku] = useState('');
  const [inventoryCount, setInventoryCount] = useState('10');
  const [tags, setTags] = useState('Billet, Aluminum, Limited');
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/product_keyboard_1790375116724.jpg'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Variants State
  const [variants, setVariants] = useState<VariantDraft[]>([
    {
      id: 'v_draft_1',
      title: 'Matte Graphite',
      sku: 'KB-6063-GR',
      price: '349.00',
      inventoryCount: '8',
      attributeKey: 'finish',
      attributeVal: 'Graphite'
    }
  ]);

  // Errors & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `v_draft_${Date.now()}`,
        title: '',
        sku: `${sku || 'SKU'}-${variants.length + 1}`,
        price: price || '0.00',
        inventoryCount: '5',
        attributeKey: 'option',
        attributeVal: 'Default'
      }
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof VariantDraft, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      title,
      slug,
      description,
      categoryId,
      price: parseFloat(price) || 0,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      costPerItem: costPerItem ? parseFloat(costPerItem) : null,
      sku: sku || undefined,
      inventoryCount: parseInt(inventoryCount, 10) || 0,
      trackQuantity: true,
      isPublished: true,
      images,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      variants: variants.map((v) => ({
        title: v.title,
        sku: v.sku,
        price: parseFloat(v.price) || 0,
        inventoryCount: parseInt(v.inventoryCount, 10) || 0,
        attributes: { [v.attributeKey]: v.attributeVal },
      })),
    };

    // Validate using Zod schema
    const validationResult = ProductCreateInputSchema.safeParse(payload);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Post to route handler
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error?.message || 'Failed to persist product');
      }

      setSuccessToast(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);
    } catch (err: any) {
      setErrors({ global: err.message || 'Database ingestion failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased pb-20">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900 border border-neutral-800 text-neutral-100 px-4 py-3 rounded-lg shadow-2xl text-xs font-medium">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Product and variants successfully published to catalog</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-neutral-900 bg-neutral-950 px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <span className="text-neutral-700">/</span>
          <span className="text-xs font-mono text-neutral-300">Catalog Ingestion</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="px-3.5 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white rounded-md text-xs font-medium transition-colors"
          >
            Discard
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 bg-neutral-100 hover:bg-white disabled:opacity-50 text-neutral-950 px-4 py-1.5 rounded-md text-xs font-semibold transition-colors"
          >
            {isSubmitting ? 'Validating...' : 'Publish Product'}
          </button>
        </div>
      </header>

      {/* Form Container */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {errors.global && (
          <div className="mb-6 p-4 rounded-lg bg-rose-950/20 border border-rose-900/60 text-xs text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errors.global}</span>
          </div>
        )}

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Information */}
          <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-200">General Specification</h2>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-mono">Product Title *</label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="e.g. KINETIC Studio Machined Keyboard"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-neutral-600"
              />
              {errors.title && <p className="text-[11px] text-rose-400">{errors.title}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Slug (URL identifier) *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kinetic-studio-machined-keyboard"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-neutral-600"
                />
                {errors.slug && <p className="text-[11px] text-rose-400">{errors.slug}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Category Hierarchy *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
                >
                  <option value="cat_hardware">Hardware & Workspaces</option>
                  <option value="cat_audio">Acoustics & Audio</option>
                  <option value="cat_ceramics">Objects & Rituals</option>
                </select>
                {errors.categoryId && <p className="text-[11px] text-rose-400">{errors.categoryId}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-400 font-mono">Detailed Engineering Prose *</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material architecture, acoustic mounting, tolerances, and design intent..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600 leading-relaxed"
              />
              {errors.description && <p className="text-[11px] text-rose-400">{errors.description}</p>}
            </div>
          </div>

          {/* Media Ingestion */}
          <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-4">
            <h2 className="text-sm font-semibold text-neutral-200">Asset Gallery</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter absolute image URL or local asset path..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600"
              />
              <button
                type="button"
                onClick={addImage}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3.5 py-2 rounded-md text-xs font-medium transition-colors"
              >
                Add Asset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative rounded-md overflow-hidden border border-neutral-800 bg-neutral-900 aspect-video group">
                  <img src={img} alt="Product media" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-neutral-950/80 p-1.5 rounded text-neutral-400 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && <p className="text-[11px] text-rose-400">{errors.images}</p>}
          </div>

          {/* Pricing & Stock Configuration */}
          <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-5">
            <h2 className="text-sm font-semibold text-neutral-200">Financials & Inventory</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Retail Base Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="349.00"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                />
                {errors.price && <p className="text-[11px] text-rose-400">{errors.price}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Compare-at Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={compareAtPrice}
                  onChange={(e) => setCompareAtPrice(e.target.value)}
                  placeholder="399.00"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Cost per Unit ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={costPerItem}
                  onChange={(e) => setCostPerItem(e.target.value)}
                  placeholder="140.00"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Master SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="KB-6063-MASTER"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Base Stock Available</label>
                <input
                  type="number"
                  value={inventoryCount}
                  onChange={(e) => setInventoryCount(e.target.value)}
                  placeholder="10"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400 font-mono">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Billet, Machined, Limited"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3.5 py-2 text-xs text-neutral-100 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Variants Matrix */}
          <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-200">Dynamic Variants</h2>
                <p className="text-xs text-neutral-500 font-mono">SKUs, sizes, finishes, and specific inventory splits</p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {variants.map((v) => (
                <div key={v.id} className="grid grid-cols-12 gap-3 p-3 bg-neutral-900/80 border border-neutral-800/80 rounded-md items-center">
                  <div className="col-span-3 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-mono">Variant Title</span>
                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) => updateVariant(v.id, 'title', e.target.value)}
                      placeholder="e.g. Matte Graphite"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-200"
                    />
                  </div>

                  <div className="col-span-3 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-mono">SKU Code</span>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                      placeholder="KB-6063-GR"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs font-mono text-neutral-300"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-mono">Price ($)</span>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs font-mono text-neutral-200"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <span className="text-[10px] text-neutral-500 font-mono">Units</span>
                    <input
                      type="number"
                      value={v.inventoryCount}
                      onChange={(e) => updateVariant(v.id, 'inventoryCount', e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs font-mono text-neutral-200"
                    />
                  </div>

                  <div className="col-span-2 flex items-center justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => removeVariant(v.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
