"use client";

import { useEffect, useMemo, useState } from "react";

type ServiceAdminForm = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  icon: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  parentService: string;
  stats: {
    yearsOfExcellence: string;
    yearsLabel: string;
    skilledProfessionals: string;
    professionalsLabel: string;
    successfulProjects: string;
    projectsLabel: string;
    happyClients: string;
    clientsLabel: string;
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    whatsappText: string;
    image: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
    foundedYear: string;
    outlets: string;
    teamSize: string;
    factoryInfo: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    image: string;
  };
  whoWeServeJson: string;
  whatIsIncludedJson: string;
  processJson: string;
  materialsJson: string;
  whyChooseUsJson: string;
  faqsJson: string;
  contactJson: string;
};

const defaultForm: ServiceAdminForm = {
  title: "",
  slug: "",
  shortDescription: "",
  fullDescription: "",
  image: "",
  icon: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  order: 0,
  isActive: true,
  isFeatured: false,
  parentService: "",
  stats: {
    yearsOfExcellence: "0",
    yearsLabel: "Years of Excellence",
    skilledProfessionals: "0",
    professionalsLabel: "Skilled professionals",
    successfulProjects: "0",
    projectsLabel: "Successful projects",
    happyClients: "0",
    clientsLabel: "Happy Clients",
  },
  cta: {
    title: "",
    subtitle: "",
    buttonText: "",
    whatsappText: "",
    image: "",
  },
  about: {
    title: "",
    description: "",
    image: "",
    foundedYear: "",
    outlets: "0",
    teamSize: "0",
    factoryInfo: "",
  },
  seo: {
    title: "",
    description: "",
    keywords: "",
    image: "",
  },
  whoWeServeJson: JSON.stringify(
    [
      {
        title: "",
        description: "",
        image: "",
        icon: "",
      },
    ],
    null,
    2,
  ),
  whatIsIncludedJson: JSON.stringify(
    [
      {
        title: "",
        description: "",
        icon: "",
      },
    ],
    null,
    2,
  ),
  processJson: JSON.stringify(
    {
      title: "",
      description: "",
      steps: [
        {
          step: "01",
          title: "",
          description: "",
          icon: "",
        },
      ],
    },
    null,
    2,
  ),
  materialsJson: JSON.stringify(
    {
      title: "",
      description: "",
      items: [
        {
          name: "",
          description: "",
          image: "",
          icon: "",
        },
      ],
    },
    null,
    2,
  ),
  whyChooseUsJson: JSON.stringify(
    {
      title: "",
      items: [
        {
          title: "",
          description: "",
          icon: "",
          image: "",
        },
      ],
    },
    null,
    2,
  ),
  faqsJson: JSON.stringify(
    [
      {
        question: "",
        answer: "",
      },
    ],
    null,
    2,
  ),
  contactJson: JSON.stringify(
    {
      title: "",
      description: "",
      buttonText: "",
      whatsappText: "",
      image: "",
    },
    null,
    2,
  ),
};

function safeJsonString(value: unknown, fallback: string) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

function parseJsonValue<T>(value: string, fallback: T): T {
  try {
    const parsed = JSON.parse(value);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function normalizeKeywords(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item));
  } catch {
    // ignore
  }
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] =
    useState<ServiceAdminForm>(defaultForm);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/services", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Could not load services.");
      }
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsLoading(false);
    }
  }

  function prepareForm(record: any): ServiceAdminForm {
    return {
      _id: record._id,
      title: record.title ?? "",
      slug: record.slug ?? "",
      shortDescription: record.shortDescription ?? "",
      fullDescription: record.fullDescription ?? "",
      image: record.image ?? "",
      icon: record.icon ?? "",
      heroTitle: record.heroTitle ?? "",
      heroSubtitle: record.heroSubtitle ?? "",
      heroImage: record.heroImage ?? "",
      order:
        typeof record.order === "number"
          ? record.order
          : Number(record.order ?? 0),
      isActive: record.isActive ?? true,
      isFeatured: record.isFeatured ?? false,
      parentService: record.parentService ?? "",
      stats: {
        yearsOfExcellence: String(record.stats?.yearsOfExcellence ?? "0"),
        yearsLabel: record.stats?.yearsLabel ?? "Years of Excellence",
        skilledProfessionals: String(record.stats?.skilledProfessionals ?? "0"),
        professionalsLabel:
          record.stats?.professionalsLabel ?? "Skilled professionals",
        successfulProjects: String(record.stats?.successfulProjects ?? "0"),
        projectsLabel: record.stats?.projectsLabel ?? "Successful projects",
        happyClients: String(record.stats?.happyClients ?? "0"),
        clientsLabel: record.stats?.clientsLabel ?? "Happy Clients",
      },
      cta: {
        title: record.cta?.title ?? "",
        subtitle: record.cta?.subtitle ?? "",
        buttonText: record.cta?.buttonText ?? "",
        whatsappText: record.cta?.whatsappText ?? "",
        image: record.cta?.image ?? "",
      },
      about: {
        title: record.about?.title ?? "",
        description: record.about?.description ?? "",
        image: record.about?.image ?? "",
        foundedYear: record.about?.foundedYear ?? "",
        outlets: String(record.about?.outlets ?? "0"),
        teamSize: String(record.about?.teamSize ?? "0"),
        factoryInfo: record.about?.factoryInfo ?? "",
      },
      seo: {
        title: record.seo?.title ?? "",
        description: record.seo?.description ?? "",
        keywords: Array.isArray(record.seo?.keywords)
          ? (record.seo.keywords as string[]).join(", ")
          : String(record.seo?.keywords ?? ""),
        image: record.seo?.image ?? "",
      },
      whoWeServeJson: safeJsonString(
        record.whoWeServe ?? [],
        JSON.stringify([], null, 2),
      ),
      whatIsIncludedJson: safeJsonString(
        record.whatIsIncluded ?? [],
        JSON.stringify([], null, 2),
      ),
      processJson: safeJsonString(
        record.process ?? { title: "", description: "", steps: [] },
        JSON.stringify({ title: "", description: "", steps: [] }, null, 2),
      ),
      materialsJson: safeJsonString(
        record.materials ?? { title: "", description: "", items: [] },
        JSON.stringify({ title: "", description: "", items: [] }, null, 2),
      ),
      whyChooseUsJson: safeJsonString(
        record.whyChooseUs ?? { title: "", items: [] },
        JSON.stringify({ title: "", items: [] }, null, 2),
      ),
      faqsJson: safeJsonString(record.faqs ?? [], JSON.stringify([], null, 2)),
      contactJson: safeJsonString(
        record.contact ?? {
          title: "",
          description: "",
          buttonText: "",
          whatsappText: "",
          image: "",
        },
        JSON.stringify(
          {
            title: "",
            description: "",
            buttonText: "",
            whatsappText: "",
            image: "",
          },
          null,
          2,
        ),
      ),
    };
  }

  function buildPayload(form: ServiceAdminForm) {
    return {
      title: form.title,
      slug: form.slug,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      image: form.image,
      icon: form.icon,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      heroImage: form.heroImage,
      order: Number(form.order ?? 0),
      isActive: Boolean(form.isActive),
      isFeatured: Boolean(form.isFeatured),
      parentService: form.parentService || null,
      stats: {
        yearsOfExcellence: Number(form.stats.yearsOfExcellence ?? 0),
        yearsLabel: form.stats.yearsLabel,
        skilledProfessionals: Number(form.stats.skilledProfessionals ?? 0),
        professionalsLabel: form.stats.professionalsLabel,
        successfulProjects: Number(form.stats.successfulProjects ?? 0),
        projectsLabel: form.stats.projectsLabel,
        happyClients: Number(form.stats.happyClients ?? 0),
        clientsLabel: form.stats.clientsLabel,
      },
      cta: form.cta,
      about: {
        title: form.about.title,
        description: form.about.description,
        image: form.about.image,
        foundedYear: form.about.foundedYear,
        outlets: Number(form.about.outlets ?? 0),
        teamSize: Number(form.about.teamSize ?? 0),
        factoryInfo: form.about.factoryInfo,
      },
      seo: {
        title: form.seo.title,
        description: form.seo.description,
        keywords: normalizeKeywords(form.seo.keywords),
        image: form.seo.image,
      },
      whoWeServe: parseJsonValue(form.whoWeServeJson, []),
      whatIsIncluded: parseJsonValue(form.whatIsIncludedJson, []),
      process: parseJsonValue(form.processJson, {
        title: "",
        description: "",
        steps: [],
      }),
      materials: parseJsonValue(form.materialsJson, {
        title: "",
        description: "",
        items: [],
      }),
      whyChooseUs: parseJsonValue(form.whyChooseUsJson, {
        title: "",
        items: [],
      }),
      faqs: parseJsonValue(form.faqsJson, []),
      contact: parseJsonValue(form.contactJson, {
        title: "",
        description: "",
        buttonText: "",
        whatsappText: "",
        image: "",
      }),
    };
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setNotification(null);

    try {
      const payload = buildPayload(selectedService);
      const endpoint = selectedService._id
        ? `/api/admin/services/${selectedService._id}`
        : "/api/admin/services";
      const method = selectedService._id ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to save service.");
      }

      const saved = await response.json();
      setNotification("Service saved successfully.");
      await loadServices();
      setSelectedService(prepareForm(saved));
      setActiveServiceId(saved._id ?? null);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedService._id) {
      setError("Choose a saved service before deleting.");
      return;
    }

    setIsDeleting(true);
    setError(null);
    setNotification(null);

    try {
      const response = await fetch(
        `/api/admin/services/${selectedService._id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Unable to delete service.");
      }
      setNotification("Service deleted successfully.");
      await loadServices();
      setSelectedService(defaultForm);
      setActiveServiceId(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err));
    } finally {
      setIsDeleting(false);
    }
  }

  function handleSelectService(service: any) {
    setSelectedService(prepareForm(service));
    setActiveServiceId(service._id ?? null);
    setShowDeleteConfirm(false);
    setNotification(null);
  }

  const filteredServices = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return services;
    return services.filter((service) => {
      return (
        service.title?.toLowerCase().includes(value) ||
        service.slug?.toLowerCase().includes(value) ||
        String(service._id).toLowerCase().includes(value)
      );
    });
  }, [searchTerm, services]);

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Services manager
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Manage Services CRUD
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Create, update, and remove service records with the fields defined
              by the live API schema.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedService(defaultForm);
              setActiveServiceId(null);
              setNotification(null);
              setShowDeleteConfirm(false);
            }}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New service
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-950">Services</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {services.length}
              </span>
            </div>
            <div className="mt-4">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, slug, or id"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="mt-5 space-y-2">
              {isLoading ? (
                <p className="text-sm text-slate-500">Loading services…</p>
              ) : filteredServices.length === 0 ? (
                <p className="text-sm text-slate-500">No services found.</p>
              ) : (
                filteredServices.map((service) => {
                  const isActiveItem = activeServiceId === service._id;
                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => handleSelectService(service)}
                      className={`w-full rounded-3xl border px-4 py-3 text-left transition ${
                        isActiveItem
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">
                            {service.title || "Untitled service"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {service.slug || "no slug"}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                          {service.isFeatured ? "Featured" : ""}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Service details
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Fill the form and save to create or update a service record.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {selectedService._id && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Delete service
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedService(defaultForm);
                    setActiveServiceId(null);
                    setNotification(null);
                    setShowDeleteConfirm(false);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Reset form
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-800">
                {error}
              </div>
            )}
            {notification && (
              <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-900">
                {notification}
              </div>
            )}

            <form className="mt-6 space-y-6" onSubmit={handleSave}>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Title
                  <input
                    value={selectedService.title}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        title: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Slug
                  <input
                    value={selectedService.slug}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        slug: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Short description
                  <textarea
                    value={selectedService.shortDescription}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        shortDescription: event.target.value,
                      })
                    }
                    rows={3}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Full description
                  <textarea
                    value={selectedService.fullDescription}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        fullDescription: event.target.value,
                      })
                    }
                    rows={3}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Image path
                  <input
                    value={selectedService.image}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        image: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Icon class
                  <input
                    value={selectedService.icon}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        icon: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Hero title
                  <input
                    value={selectedService.heroTitle}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        heroTitle: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Hero subtitle
                  <input
                    value={selectedService.heroSubtitle}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        heroSubtitle: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Hero image path
                  <input
                    value={selectedService.heroImage}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        heroImage: event.target.value,
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Order
                    <input
                      type="number"
                      value={selectedService.order}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          order: Number(event.target.value),
                        })
                      }
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Parent service
                    <input
                      value={selectedService.parentService}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          parentService: event.target.value,
                        })
                      }
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Active
                  <select
                    value={selectedService.isActive ? "active" : "inactive"}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        isActive: event.target.value === "active",
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Featured
                  <select
                    value={selectedService.isFeatured ? "yes" : "no"}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        isFeatured: event.target.value === "yes",
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Stats years
                  <input
                    type="number"
                    value={selectedService.stats.yearsOfExcellence}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        stats: {
                          ...selectedService.stats,
                          yearsOfExcellence: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Stats professionals
                  <input
                    type="number"
                    value={selectedService.stats.skilledProfessionals}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        stats: {
                          ...selectedService.stats,
                          skilledProfessionals: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Stats successful projects
                  <input
                    type="number"
                    value={selectedService.stats.successfulProjects}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        stats: {
                          ...selectedService.stats,
                          successfulProjects: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  Stats happy clients
                  <input
                    type="number"
                    value={selectedService.stats.happyClients}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        stats: {
                          ...selectedService.stats,
                          happyClients: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  CTA title
                  <input
                    value={selectedService.cta.title}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        cta: {
                          ...selectedService.cta,
                          title: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  CTA button text
                  <input
                    value={selectedService.cta.buttonText}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        cta: {
                          ...selectedService.cta,
                          buttonText: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  SEO title
                  <input
                    value={selectedService.seo.title}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        seo: {
                          ...selectedService.seo,
                          title: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  SEO keywords
                  <input
                    value={selectedService.seo.keywords}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        seo: {
                          ...selectedService.seo,
                          keywords: event.target.value,
                        },
                      })
                    }
                    placeholder="service, joinery, dubai"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  SEO description
                  <textarea
                    value={selectedService.seo.description}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        seo: {
                          ...selectedService.seo,
                          description: event.target.value,
                        },
                      })
                    }
                    rows={3}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-700">
                  SEO image path
                  <input
                    value={selectedService.seo.image}
                    onChange={(event) =>
                      setSelectedService({
                        ...selectedService,
                        seo: {
                          ...selectedService.seo,
                          image: event.target.value,
                        },
                      })
                    }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  />
                </label>
              </div>

              <div className="space-y-4 rounded-[32px] border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-semibold text-slate-950">
                  Advanced JSON fields
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  Use the JSON editors below for nested service blocks like
                  whoWeServe, whatIsIncluded, process, materials, whyChooseUs,
                  faqs, and contact details.
                </p>

                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Who we serve
                    <textarea
                      value={selectedService.whoWeServeJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          whoWeServeJson: event.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    What is included
                    <textarea
                      value={selectedService.whatIsIncludedJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          whatIsIncludedJson: event.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Process JSON
                    <textarea
                      value={selectedService.processJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          processJson: event.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Materials JSON
                    <textarea
                      value={selectedService.materialsJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          materialsJson: event.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Why choose us JSON
                    <textarea
                      value={selectedService.whyChooseUsJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          whyChooseUsJson: event.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    FAQ JSON
                    <textarea
                      value={selectedService.faqsJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          faqsJson: event.target.value,
                        })
                      }
                      rows={6}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                </div>

                <div>
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Contact section JSON
                    <textarea
                      value={selectedService.contactJson}
                      onChange={(event) =>
                        setSelectedService({
                          ...selectedService,
                          contactJson: event.target.value,
                        })
                      }
                      rows={5}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm text-slate-600">
                  <p className="font-medium text-slate-900">Submit changes</p>
                  <p>
                    JSON fields must be valid. Use arrays for list sections.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isSaving ? "Saving…" : "Save service"}
                </button>
              </div>
            </form>
          </div>

          {showDeleteConfirm && selectedService._id ? (
            <div className="rounded-[32px] border border-rose-200 bg-rose-50 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-rose-900">
                    Confirm deletion
                  </h3>
                  <p className="mt-2 text-sm text-rose-800">
                    This action will remove the selected service record
                    permanently.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="rounded-2xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-rose-400"
                  >
                    {isDeleting ? "Deleting…" : "Delete service"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
