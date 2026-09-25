import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { ProductCreateInputSchema } from '@/lib/zod-schemas';

interface AdminProductNewViewProps {
  onBack: () => void;
  onProductCreated: (product: ProductItem) => void;
}

export const AdminProductNewView: React.FC<AdminProductNewViewProps> = ({
  onBack,
  onProductCreated,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('cat_phones');
  const [price, setPrice] = useState('450000');
  const [compareAtPrice, setCompareAtPrice] = useState('600000');
  const [costPerItem, setCostPerItem] = useState('320000');
  const [sku, setSku] = useState('FOX-UG-NEW');
  const [inventoryCount, setInventoryCount] = useState('25');
  const [tags, setTags] = useState('Official Store, Flash Sale, Kampala Stock');
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/product_phone_1790375946472.jpg'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  const [variants, setVariants] = useState([
    {
      id: 'v_1',
      title: 'Standard Edition',
      sku: 'FOX-UG-NEW-01',
      price: '450000',
      inventoryCount: '25',
    }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setSlug(autoSlug);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `v_${Date.now()}`,
        title: '',
        sku: `${sku}-${variants.length + 1}`,
        price: price || '0.00',
        inventoryCount: '5',
      }
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
        attributes: { option: v.title },
      })),
    };

    const validationResult = ProductCreateInputSchema.safeParse(payload);

    if (!validationResult.success) {
      const errMap: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        errMap[err.path.join('.')] = err.message;
      });
      setErrors(errMap);
      setIsSubmitting(false);
      return;
    }

    const newProd: ProductItem = {
      id: `prod_${Date.now()}`,
      title,
      slug,
      description,
      price: parseFloat(price) || 0,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      costPerItem: costPerItem ? parseFloat(costPerItem) : undefined,
      sku: sku || undefined,
      inventoryCount: parseInt(inventoryCount, 10) || 0,
      trackQuantity: true,
      isPublished: true,
      images,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      rating: 5.0,
      reviewCount: 0,
      categoryId,
      categoryName:
        categoryId === 'cat_hardware'
          ? 'Hardware & Workspaces'
          : categoryId === 'cat_audio'
          ? 'Acoustics & Audio'
          : 'Objects & Rituals',
      variants: variants.map((v, i) => ({
        id: `v_${Date.now()}_${i}`,
        productId: `prod_${Date.now()}`,
        title: v.title,
        sku: v.sku,
        price: parseFloat(v.price) || 0,
        inventoryCount: parseInt(v.inventoryCount, 10) || 0,
        attributes: { option: v.title },
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onProductCreated(newProd);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Admin Console</span>
        </button>
        <span className="text-xs font-mono text-neutral-400">CATALOG_INGESTION_V2</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Info */}
        <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-200">Product Specification</h2>

          <div className="space-y-1">
            <label className="text-xs text-neutral-400 font-mono">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. KINETIC Precision Brass Weight Desk Tray"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:outline-none"
            />
            {errors.title && <p className="text-[11px] text-rose-400">{errors.title}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-neutral-400 font-mono">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-300"
              />
              {errors.slug && <p className="text-[11px] text-rose-400">{errors.slug}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-400 font-mono">Category Hierarchy *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200"
              >
                <option value="cat_hardware">Hardware & Workspaces</option>
                <option value="cat_audio">Acoustics & Audio</option>
                <option value="cat_ceramics">Objects & Rituals</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-400 font-mono">Engineering Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail tolerances, finishes, and functional utility..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200"
            />
            {errors.description && <p className="text-[11px] text-rose-400">{errors.description}</p>}
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-200">Financials & Units</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-neutral-400 font-mono">Retail Price ($) *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-100"
              />
              {errors.price && <p className="text-[11px] text-rose-400">{errors.price}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-400 font-mono">Compare-at Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-400 font-mono">Initial Available Stock</label>
              <input
                type="number"
                value={inventoryCount}
                onChange={(e) => setInventoryCount(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-neutral-100"
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="p-6 rounded-lg border border-neutral-900 bg-neutral-900/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">Variants Configuration</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 bg-neutral-800 text-neutral-200 px-3 py-1 rounded text-xs hover:bg-neutral-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-2">
            {variants.map((v, idx) => (
              <div key={v.id} className="grid grid-cols-12 gap-2 p-2 bg-neutral-950 border border-neutral-800 rounded items-center">
                <input
                  type="text"
                  placeholder="Variant Title"
                  value={v.title}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].title = e.target.value;
                    setVariants(updated);
                  }}
                  className="col-span-4 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-200"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={v.sku}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].sku = e.target.value;
                    setVariants(updated);
                  }}
                  className="col-span-3 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs font-mono text-neutral-300"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].price = e.target.value;
                    setVariants(updated);
                  }}
                  className="col-span-2 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs font-mono text-neutral-200"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.inventoryCount}
                  onChange={(e) => {
                    const updated = [...variants];
                    updated[idx].inventoryCount = e.target.value;
                    setVariants(updated);
                  }}
                  className="col-span-2 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-xs font-mono text-neutral-200"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(v.id)}
                  className="col-span-1 text-neutral-500 hover:text-rose-400 p-1 flex justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-neutral-800 text-neutral-300 hover:text-white rounded text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-neutral-100 hover:bg-white text-neutral-950 font-semibold px-6 py-2 rounded text-xs transition-colors"
          >
            {isSubmitting ? 'Validating...' : 'Commit to Catalog'}
          </button>
        </div>
      </form>
    </div>
  );
};
