"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  type AdminField,
  type AdminModule,
} from "@/lib/admin-modules";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useAdminRole } from "@/components/admin/admin-role-context";

type AdminRecord = Record<string, unknown>;
type RelationOptions = Record<string, { label: string; value: string }[]>;

function displayValue(value: unknown, fieldName: string) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Active" : "Inactive";
  if (fieldName.endsWith("_price_zar") || fieldName === "price_zar") {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  }
  if (fieldName === "is_published") return value ? "Published" : "Hidden";
  if (fieldName === "in_stock") return value ? "In stock" : "Out of stock";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function getCreateLabel(title: string) {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.endsWith("ies")) return `${normalizedTitle.slice(0, -3)}y`;
  return normalizedTitle.endsWith("s") ? normalizedTitle.slice(0, -1) : normalizedTitle;
}

function getFieldValue(field: AdminField, record?: AdminRecord | null) {
  const value = record?.[field.name];
  if (value !== undefined && value !== null) {
    if (field.type === "json") return JSON.stringify(value, null, 2);
    if (field.type === "datetime-local" && typeof value === "string") {
      return value.slice(0, 16);
    }
    return String(value);
  }
  if (field.defaultValue !== undefined) return String(field.defaultValue);
  return "";
}

function getRecordPayload(formData: FormData, fields: AdminField[]) {
  const payload: AdminRecord = {};

  for (const field of fields) {
    if (field.type === "boolean") {
      payload[field.name] = formData.get(field.name) === "on";
      continue;
    }
    if (field.type === "image") {
      const upload = formData.get(`upload:${field.name}`);
      const uploadFile = upload instanceof File && upload.size > 0;
      const rawValue = String(formData.get(field.name) ?? "").trim();
      if (uploadFile) {
        payload[`upload:${field.name}`] = upload;
      } else if (rawValue) {
        payload[field.name] = rawValue;
      } else if (field.nullable) {
        payload[field.name] = null;
      }
      continue;
    }
    if (field.type === "gallery") {
      const retainedImages = formData.getAll(`keep:${field.name}`).map(String);
      const uploads = formData
        .getAll(`upload:${field.name}`)
        .filter((file): file is File => file instanceof File && file.size > 0);
      if (retainedImages.length + uploads.length > 12) {
        return { error: `${field.label} can contain no more than 12 images.` };
      }
      payload[field.name] = retainedImages;
      if (uploads.length) payload[`upload:${field.name}`] = uploads;
      continue;
    }

    const rawValue = String(formData.get(field.name) ?? "").trim();
    if (!rawValue) {
      if (field.required) {
        return { error: `${field.label} is required.` };
      }
      if (field.nullable || field.type === "relation") payload[field.name] = null;
      continue;
    }

    if (field.type === "number") {
      const value = Number(rawValue);
      if (!Number.isFinite(value)) return { error: `${field.label} must be a valid number.` };
      payload[field.name] = value;
      continue;
    }

    if (field.type === "json") {
      try {
        payload[field.name] = JSON.parse(rawValue);
      } catch {
        return { error: `${field.label} must contain valid JSON.` };
      }
      continue;
    }

    if (field.type === "datetime-local") {
      const date = new Date(rawValue);
      if (Number.isNaN(date.getTime())) return { error: `${field.label} must be a valid date and time.` };
      payload[field.name] = date.toISOString();
      continue;
    }

    payload[field.name] = rawValue;
  }

  return { payload };
}

function RecordForm({
  module,
  record,
  relations,
  onCancel,
  onSave,
  currentUserId,
}: {
  module: AdminModule;
  record?: AdminRecord | null;
  relations: RelationOptions;
  currentUserId: string | null;
  onCancel: () => void;
  onSave: (formData: FormData, record?: AdminRecord | null) => Promise<void>;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);
    await onSave(new FormData(event.currentTarget), record).catch((saveError: unknown) => {
      setError(saveError instanceof Error ? saveError.message : "The record could not be saved.");
    });
    setIsSaving(false);
  }

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <section className="admin-record-modal" role="dialog" aria-modal="true" aria-labelledby="admin-record-title">
        <div className="admin-modal-heading">
          <div>
            <p className="admin-kicker">{record ? "EDIT RECORD" : "NEW RECORD"}</p>
            <h2 id="admin-record-title">{record ? "Update" : "Create"} {module.title.toLowerCase()}</h2>
          </div>
          <button className="admin-modal-close" onClick={onCancel} type="button" aria-label="Close editor">×</button>
        </div>
        <form className="admin-record-form" onSubmit={submit}>
          <div className="admin-record-fields">
            {module.fields.map((field) => {
              const value = getFieldValue(field, record);
              if (field.type === "boolean") {
                return (
                  <label className="admin-checkbox-field" key={field.name}>
                    <input
                      defaultChecked={record ? Boolean(record[field.name]) : Boolean(field.defaultValue)}
                      name={field.name}
                      type="checkbox"
                    />
                    <span><strong>{field.label}</strong>{field.helpText && <small>{field.helpText}</small>}</span>
                  </label>
                );
              }

              if (field.type === "gallery") {
                const galleryValue = record?.[field.name];
                const images = Array.isArray(galleryValue)
                  ? galleryValue.filter((image): image is string => typeof image === "string")
                  : [];
                return (
                  <div className="admin-form-field is-wide" key={field.name}>
                    <span>{field.label}</span>
                    {images.length > 0 && (
                      <div className="admin-gallery-grid">
                        {images.map((image, index) => (
                          <label className="admin-gallery-item" key={`${image}-${index}`}>
                            <input defaultChecked name={`keep:${field.name}`} type="checkbox" value={image} />
                            <Image alt={`Product gallery image ${index + 1}`} height={96} src={image} unoptimized width={128} />
                            <span>Keep image {index + 1}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <input
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      multiple
                      name={`upload:${field.name}`}
                      type="file"
                    />
                    {field.helpText && <small>{field.helpText}</small>}
                  </div>
                );
              }

              return (
                <label className={`admin-form-field${field.type === "textarea" || field.type === "json" ? " is-wide" : ""}`} key={field.name}>
                  <span>{field.label}{field.required && <i aria-hidden="true"> *</i>}</span>
                  {field.type === "image" ? (
                    <>
                      {value && (
                        <Image
                          alt={`Current ${field.label.toLowerCase()}`}
                          className="admin-image-preview"
                          height={120}
                          src={value}
                          unoptimized
                          width={180}
                        />
                      )}
                      <input
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        name={`upload:${field.name}`}
                        type="file"
                      />
                      <span className="admin-image-or">or</span>
                      <input
                        defaultValue={value}
                        name={field.name}
                        type="url"
                      />
                    </>
                  ) : field.type === "textarea" || field.type === "json" ? (
                    <textarea
                      defaultValue={value}
                      name={field.name}
                      required={field.required}
                      rows={field.type === "json" ? 5 : 4}
                    />
                  ) : field.type === "select" || field.type === "relation" ? (
                    <select
                      defaultValue={value}
                      disabled={field.name === "role" && record?.id === currentUserId}
                      name={field.name}
                      required={field.required}
                    >
                      {!field.required && <option value="">None selected</option>}
                      {(field.options ?? relations[field.name] ?? []).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      defaultValue={value}
                      name={field.name}
                      required={field.required}
                      step={field.step}
                      type={field.type}
                    />
                  )}
                  {field.helpText && <small>{field.helpText}</small>}
                </label>
              );
            })}
          </div>
          {error && <p className="admin-form-error" role="alert">{error}</p>}
          <div className="admin-form-actions">
            <button className="admin-button admin-button-subtle" onClick={onCancel} type="button">Cancel</button>
            <button className="admin-button admin-button-primary" disabled={isSaving} type="submit">
              {isSaving ? "Saving..." : record ? "Save changes" : "Create record"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function AdminCrud({ module }: { module: AdminModule }) {
  const canManage = useAdminRole() !== "staff";
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [records, setRecords] = useState<AdminRecord[]>([]);
  const [relations, setRelations] = useState<RelationOptions>({});
  const [editing, setEditing] = useState<AdminRecord | null | undefined>();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const loadRecords = useCallback(async () => {
    setIsLoading(true);
    setError("");

    if (module.key === "admins") {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        setError(userError.message);
        setRecords([]);
        setIsLoading(false);
        return;
      }
      setCurrentUserId(user?.id ?? null);
    }

    const { data, error: loadError } = await supabase
      .from(module.table)
      .select("*")
      .order(module.orderBy, { ascending: module.orderAscending ?? true });

    if (loadError) {
      setError(loadError.message);
      setRecords([]);
      setIsLoading(false);
      return;
    }

    const relationFields = module.fields.filter((field) => field.type === "relation" && field.relatedTable);
    const relationEntries = await Promise.all(relationFields.map(async (field) => {
      const { data: options, error: relationError } = await supabase
        .from(field.relatedTable as string)
        .select("*")
        .order(field.relatedLabel as string, { ascending: true });
      if (relationError) throw new Error(relationError.message);
      return {
        key: field.name,
        options: (options ?? []).map((option: AdminRecord) => ({
          value: String(option[field.relatedValue as string]),
          label: String(option[field.relatedLabel as string]),
        })),
      };
    })).catch((relationError: unknown) => {
      setError(relationError instanceof Error ? relationError.message : "Unable to load related records.");
      return [];
    });
    setRecords(data ?? []);
    setRelations(Object.fromEntries(relationEntries.map(({ key, options }) => [key, options])));
    setIsLoading(false);
  }, [module, supabase]);

  useEffect(() => {
    let active = true;
    async function fetchRecords() {
      await loadRecords();
      if (!active) return;
    }
    void fetchRecords();
    return () => {
      active = false;
    };
  }, [loadRecords]);

  async function saveRecord(formData: FormData, record?: AdminRecord | null) {
    const parsed = getRecordPayload(formData, module.fields);
    if ("error" in parsed) throw new Error(parsed.error);
    const payload = parsed.payload;

    for (const field of module.fields.filter((item) => item.type === "image" || item.type === "gallery")) {
      const upload = payload[`upload:${field.name}`];
      delete payload[`upload:${field.name}`];
      const uploads = field.type === "gallery"
        ? Array.isArray(upload) ? upload.filter((file): file is File => file instanceof File) : []
        : upload instanceof File ? [upload] : [];
      if (!uploads.length) continue;

      const uploadedUrls: string[] = [];
      for (const file of uploads) {
        if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
          throw new Error(`${field.label} must use JPEG, PNG, WebP, or AVIF images.`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`Each ${field.label.toLowerCase()} image must be smaller than 10 MB.`);
        }

        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const objectPath = `${module.table}/${crypto.randomUUID()}-${sanitizedName}`;
        const { error: uploadError } = await supabase.storage
          .from("catalog-media")
          .upload(objectPath, file, { contentType: file.type, upsert: false });
        if (uploadError) throw new Error(`Unable to upload ${field.label.toLowerCase()}: ${uploadError.message}`);
        uploadedUrls.push(supabase.storage.from("catalog-media").getPublicUrl(objectPath).data.publicUrl);
      }

      if (field.type === "gallery") {
        const retainedUrls = Array.isArray(payload[field.name]) ? payload[field.name] as string[] : [];
        payload[field.name] = [...retainedUrls, ...uploadedUrls];
      } else {
        payload[field.name] = uploadedUrls[0];
      }
    }

    let result;

    if (record) {
      let request = supabase.from(module.table).update(payload);
      for (const key of module.primaryKey) request = request.eq(key, record[key] as string);
      result = await request;
    } else {
      result = await supabase.from(module.table).insert(payload);
    }

    if (result.error) throw new Error(result.error.message);
    setEditing(undefined);
    setNotice(record ? "Changes saved." : "Record created.");
    await loadRecords();
  }

  async function deleteRecord(record: AdminRecord) {
    const label = String(record[module.columns[0]] ?? module.title.toLowerCase());
    if (!window.confirm(`Delete "${label}"? This action cannot be undone.`)) return;

    let request = supabase.from(module.table).delete();
    for (const key of module.primaryKey) request = request.eq(key, record[key] as string);
    const { error: deleteError } = await request;
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setNotice("Record deleted.");
    await loadRecords();
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleRecords = records.filter((record) =>
    module.columns.some((column) => String(record[column] ?? "").toLowerCase().includes(normalizedQuery)),
  );
  const relationLabels = new Map(
    Object.values(relations).flat().map(({ value, label }) => [value, label]),
  );

  return (
    <section className="admin-crud-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-kicker">CONTENT MANAGEMENT</p>
          <h1>{module.title}</h1>
          <p className="admin-page-subtitle">{module.description}</p>
        </div>
        {canManage && module.canCreate !== false && (
          <button className="admin-button admin-button-primary" onClick={() => setEditing(null)} type="button">
            <span aria-hidden="true">＋</span> Add {getCreateLabel(module.title)}
          </button>
        )}
      </div>
      {module.notice && <div className="admin-notice"><span aria-hidden="true">i</span>{module.notice}</div>}
      {notice && <p className="admin-success-message" role="status">{notice}</p>}
      {error && <p className="admin-form-error admin-query-error" role="alert">{error}</p>}

      <div className="admin-table-panel">
        <div className="admin-table-toolbar">
          <div><strong>{records.length.toLocaleString("en-ZA")}</strong><span> total records</span></div>
          <label className="admin-search">
            <span aria-hidden="true">⌕</span>
            <input aria-label={`Search ${module.title}`} onChange={(event) => setQuery(event.target.value)} type="search" />
          </label>
        </div>
        {isLoading ? (
          <div className="admin-table-loading" role="status">Loading {module.title.toLowerCase()}...</div>
        ) : visibleRecords.length ? (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  {module.columns.map((column) => <th key={column}>{column.replaceAll("_", " ")}</th>)}
                  <th><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {visibleRecords.map((record, index) => (
                  <tr key={module.primaryKey.map((key) => String(record[key])).join(":") || index}>
                    {module.columns.map((column) => {
                      const value = record[column];
                      const isStatus = ["is_published", "in_stock", "is_active", "role"].includes(column);
                      const active = column === "role" ? value === "superadmin" : Boolean(value);
                      return (
                        <td key={column}>
                          {isStatus ? (
                            <span className={`admin-status-pill${active ? " is-active" : ""}`}>
                              <i />{displayValue(value, column)}
                            </span>
                          ) : (
                            <span className={column === module.columns[0] ? "admin-table-primary-value" : ""}>
                              {relationLabels.get(String(value)) ?? displayValue(value, column)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {canManage && (
                      <td className="admin-row-actions">
                        <button aria-label={`Edit ${String(record[module.columns[0]])}`} onClick={() => setEditing(record)} type="button">Edit</button>
                        {module.canDelete !== false && (
                          <button aria-label={`Delete ${String(record[module.columns[0]])}`} className="is-danger" onClick={() => void deleteRecord(record)} type="button">Delete</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state">
            <span aria-hidden="true">✦</span>
            <h2>{query ? "No matching records" : `No ${module.title.toLowerCase()} yet`}</h2>
            <p>{query ? "Try a different search." : "Create a record to add it to the workspace."}</p>
            {!query && canManage && module.canCreate !== false && (
              <button className="admin-button admin-button-subtle" onClick={() => setEditing(null)} type="button">
                Create the first record
              </button>
            )}
          </div>
        )}
        {!isLoading && visibleRecords.length > 0 && (
          <div className="admin-table-footer">Showing {visibleRecords.length.toLocaleString("en-ZA")} of {records.length.toLocaleString("en-ZA")} records</div>
        )}
      </div>

      {editing !== undefined && (
        <RecordForm
          module={module}
          currentUserId={currentUserId}
          onCancel={() => setEditing(undefined)}
          onSave={saveRecord}
          record={editing}
          relations={relations}
        />
      )}
    </section>
  );
}
