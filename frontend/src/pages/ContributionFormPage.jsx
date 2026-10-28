import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Utensils,
  Music,
  Palette,
  Mountain,
  Home,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Save,
  ArrowLeft,
  Info,
  Clock,
  Ticket,
  ShieldCheck,
  Eye,
  Camera
} from 'lucide-react';

const CONTRIBUTION_TYPES = [
  {
    id: 'hidden-place',
    label: 'Hidden Place',
    icon: MapPin,
    description: 'Ancient ruins, secret viewpoints, waterbodies, or unmapped shrines.'
  },
  {
    id: 'local-food',
    label: 'Local Food',
    icon: Utensils,
    description: 'Heirloom family recipes, village dhabas, street food, or seasonal sweets.'
  },
  {
    id: 'folk-culture',
    label: 'Folk & Culture',
    icon: Music,
    description: 'Tribal festivals, oral balladeers, ritual music, or regional theater.'
  },
  {
    id: 'arts-crafts',
    label: 'Arts & Crafts',
    icon: Palette,
    description: 'Handloom weaving, terracotta sculpting, metal casting, or woodwork.'
  },
  {
    id: 'nature-adventure',
    label: 'Nature & Adventure',
    icon: Mountain,
    description: 'Boulder trails, river rapids, sacred groves, or birding spots.'
  },
  {
    id: 'village-experience',
    label: 'Village Experience',
    icon: Home,
    description: 'Farmstead stays, community farming walks, or indigenous settlements.'
  }
];

export default function ContributionFormPage({ onCancel, onShowToast }) {
  // Selected Contribution Type
  const [selectedType, setSelectedType] = useState('hidden-place');

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hidden Place',
    shortDescription: '',
    detailedStory: '',
    destinationName: '',
    state: '',
    district: '',
    landmark: '',
    latitude: '',
    longitude: '',
    // Conditional Practical fields
    foodType: '',
    dietaryInfo: 'Vegetarian',
    typicalPrice: '',
    traditionType: '',
    usualSeason: '',
    craftType: '',
    workshopAvailability: 'Available upon request',
    activityType: '',
    estimatedDuration: '',
    accessibilityNotes: '',
    villageDescription: '',
    villageDuration: 'Half Day',
    bestVisitingTime: '',
    entryFee: '',
    // Community & Verification
    contributorName: 'Bhavna (Community Storyteller)',
    localTips: '',
    confirmAccurate: false,
    photoRights: false
  });

  // Photo upload preview (client-side demo)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Validation Errors & Submission State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Load existing draft if present
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('yatrasaathi_contribution_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      // LocalStorage access silently handled
    }
  }, []);

  // Update type and default category label
  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    const typeObj = CONTRIBUTION_TYPES.find((t) => t.id === typeId);
    if (typeObj) {
      setFormData((prev) => ({ ...prev, category: typeObj.label }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for field on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Image handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please choose a smaller image.");
        return;
      }
      setSelectedImage(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
  };

  // Save draft locally
  const handleSaveDraft = () => {
    try {
      localStorage.setItem('yatrasaathi_contribution_draft', JSON.stringify(formData));
      if (onShowToast) {
        onShowToast('Draft saved successfully to your browser! 💾');
      } else {
        alert('Draft saved locally.');
      }
    } catch (err) {
      alert('Unable to save draft locally.');
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Contribution title is required.';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required.';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'A brief overview is required.';
    } else if (formData.shortDescription.length < 20) {
      newErrors.shortDescription = 'Please provide at least 20 characters describing the gem.';
    }
    if (!formData.destinationName.trim()) {
      newErrors.destinationName = 'Destination or village name is required.';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required.';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'District or city is required.';
    }
    if (!formData.confirmAccurate) {
      newErrors.confirmAccurate = 'You must confirm that this information is accurate.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to top error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate demo network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedData({
        ...formData,
        imagePreview: imagePreviewUrl,
        typeLabel: CONTRIBUTION_TYPES.find((t) => t.id === selectedType)?.label
      });
      // Clear draft on successful submit
      try {
        localStorage.removeItem('yatrasaathi_contribution_draft');
      } catch (err) {}

      if (onShowToast) {
        onShowToast('🎉 Gem submitted! Thank you for empowering community tourism.');
      }
    }, 700);
  };

  // If submitted, show success state
  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-canvas py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-card rounded-xl border border-border-subtle p-8 shadow-level-2 text-center animate-scaleIn">
          <div className="w-16 h-16 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
          </div>

          <span className="text-[11px] font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Demo Contribution Recorded
          </span>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-3 mb-2">
            Thank you, {submittedData.contributorName.split(' ')[0]}!
          </h2>

          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
            Your suggested contribution for <span className="font-bold text-slate-900">"{submittedData.title}"</span> has been captured. In the live platform, community elders and local tourism verifiers review submitted gems before publishing them to the YatraSaathi AI knowledgebase.
          </p>

          {/* Submission Summary Card */}
          <div className="p-4 bg-subtle rounded-lg border border-border-subtle text-left space-y-2 text-xs sm:text-sm text-slate-700 mb-6">
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-900">{submittedData.typeLabel}</span>
            </div>
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-900">{submittedData.destinationName}, {submittedData.district}, {submittedData.state}</span>
            </div>
            {submittedData.landmark && (
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-slate-500">Landmark:</span>
                <span className="font-semibold text-slate-900">{submittedData.landmark}</span>
              </div>
            )}
            <div className="pt-1">
              <span className="text-slate-500 block mb-1">Description:</span>
              <p className="text-slate-600 text-xs italic">"{submittedData.shortDescription}"</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-md border border-amber-200 text-xs text-amber-800 text-left mb-6">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <span>
                <strong>Demo Mode:</strong> No external backend or database was modified. Your contribution is simulated client-side for the hackathon MVP.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  title: '',
                  category: 'Hidden Place',
                  shortDescription: '',
                  detailedStory: '',
                  destinationName: '',
                  state: '',
                  district: '',
                  landmark: '',
                  latitude: '',
                  longitude: '',
                  foodType: '',
                  dietaryInfo: 'Vegetarian',
                  typicalPrice: '',
                  traditionType: '',
                  usualSeason: '',
                  craftType: '',
                  workshopAvailability: 'Available upon request',
                  activityType: '',
                  estimatedDuration: '',
                  accessibilityNotes: '',
                  villageDescription: '',
                  villageDuration: 'Half Day',
                  bestVisitingTime: '',
                  entryFee: '',
                  contributorName: 'Bhavna (Community Storyteller)',
                  localTips: '',
                  confirmAccurate: false,
                  photoRights: false
                });
                setImagePreviewUrl(null);
                setSelectedImage(null);
              }}
              className="btn-secondary w-full sm:w-auto text-xs py-2.5 px-5"
            >
              Submit Another Gem
            </button>

            <button
              onClick={onCancel}
              className="btn-primary w-full sm:w-auto text-xs py-2.5 px-6"
            >
              Explore Experiences
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pb-20 animate-fadeInUp">
      {/* 2. Scenic Community Travel Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=2000&q=80"
            alt="Local Cultural Heritage & Community Tourism"
            className="w-full h-full object-cover object-center opacity-35 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/45" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors mb-4 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F45B0B] text-white text-[11px] font-bold tracking-wider uppercase mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>COMMUNITY POWERED • PRESERVING TRADITIONS</span>
          </div>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            Share a Hidden Gem
          </h1>
          <p className="mt-2 text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
            Your local knowledge can help travelers discover the authentic beauty, culinary heritage, and stories of your community.
          </p>
        </div>
      </section>

      {/* Main Form Form Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* 3. Contribution Type Selection */}
          <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1">
            <h2 className="font-display font-bold text-lg text-slate-900 mb-1">
              1. What type of gem are you sharing? <span className="text-primary">*</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Select the option that best describes your recommendation:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CONTRIBUTION_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => handleTypeSelect(type.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                        : "border-border-subtle bg-canvas hover:border-slate-300 hover:bg-subtle"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          isSelected ? "bg-primary text-white" : "bg-card text-slate-700 border border-border-subtle"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-xs ${isSelected ? "text-primary" : "text-slate-900"}`}>
                        {type.label}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 4.A Basic Information */}
          <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-border-subtle pb-2">
              2. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Contribution Title */}
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Contribution Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Hidden Chhattri by the Betwa Rapids, or Secret Clay Tile Studio"
                  className={`input-terra w-full ${errors.title ? "border-red-500 ring-2 ring-red-200" : ""}`}
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Destination / Village Name */}
              <div>
                <label htmlFor="destinationName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Destination or Village Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="destinationName"
                  name="destinationName"
                  value={formData.destinationName}
                  onChange={handleChange}
                  placeholder="e.g. Orchha, Majuli, Taraigram"
                  className={`input-terra w-full ${errors.destinationName ? "border-red-500 ring-2 ring-red-200" : ""}`}
                />
                {errors.destinationName && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.destinationName}</span>
                  </p>
                )}
              </div>

              {/* Category display */}
              <div>
                <label htmlFor="category" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Category Tag <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-terra w-full bg-slate-50 cursor-not-allowed"
                  readOnly
                />
              </div>

              {/* Short Description */}
              <div className="sm:col-span-2">
                <label htmlFor="shortDescription" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Short Description <span className="text-primary">*</span>
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  rows={3}
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Describe what makes this experience or place special in 2–3 sentences..."
                  className={`input-terra w-full resize-none ${errors.shortDescription ? "border-red-500 ring-2 ring-red-200" : ""}`}
                />
                <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                  <span>Minimum 20 characters recommended.</span>
                  <span>{formData.shortDescription.length} characters</span>
                </div>
                {errors.shortDescription && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.shortDescription}</span>
                  </p>
                )}
              </div>

              {/* Detailed Story (Optional) */}
              <div className="sm:col-span-2">
                <label htmlFor="detailedStory" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Detailed Story or Cultural Significance <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="detailedStory"
                  name="detailedStory"
                  rows={4}
                  value={formData.detailedStory}
                  onChange={handleChange}
                  placeholder="Share local folklore, the family history behind the recipe, or the origin of the artisan craft..."
                  className="input-terra w-full resize-none"
                />
              </div>
            </div>
          </section>

          {/* 4.B Location */}
          <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-border-subtle pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>3. Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State */}
              <div>
                <label htmlFor="state" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  State <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Madhya Pradesh, Assam, Rajasthan"
                  className={`input-terra w-full ${errors.state ? "border-red-500 ring-2 ring-red-200" : ""}`}
                />
                {errors.state && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.state}</span>
                  </p>
                )}
              </div>

              {/* District or City */}
              <div>
                <label htmlFor="district" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  District or City <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Niwari, Jorhat, Udaipur"
                  className={`input-terra w-full ${errors.district ? "border-red-500 ring-2 ring-red-200" : ""}`}
                />
                {errors.district && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.district}</span>
                  </p>
                )}
              </div>

              {/* Specific Landmark */}
              <div className="sm:col-span-2">
                <label htmlFor="landmark" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Specific Location or Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="e.g. 200m past Kanchan Ghat, behind the Old Banyan Tree"
                  className="input-terra w-full"
                />
              </div>

              {/* Optional Coordinates */}
              <div>
                <label htmlFor="latitude" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Latitude <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g. 25.3524"
                  className="input-terra w-full"
                />
              </div>

              <div>
                <label htmlFor="longitude" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Longitude <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g. 78.6416"
                  className="input-terra w-full"
                />
              </div>
            </div>
          </section>

          {/* 4.C Photos */}
          <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-border-subtle pb-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span>4. Photos & Visuals</span>
            </h2>

            <div>
              {imagePreviewUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-border-subtle max-w-sm animate-scaleIn">
                  <img
                    src={imagePreviewUrl}
                    alt="Uploaded preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 flex items-center justify-center transition-colors shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="p-2 bg-white text-xs text-slate-600 truncate">
                    {selectedImage?.name} ({(selectedImage?.size / (1024 * 1024)).toFixed(2)} MB)
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-border-subtle hover:border-primary/50 bg-subtle/50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors block">
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-slate-400 shadow-sm mb-2">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Click to select a photo, or drag and drop
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    Supports PNG, JPG, WebP up to 5MB (processed locally in demo)
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </section>

          {/* 4.D Practical Information (Conditional fields) */}
          <section
            key={selectedType}
            className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-4 animate-fadeInUp"
          >
            <div className="border-b border-border-subtle pb-2">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-tertiary" />
                <span>5. Practical Visitor Information</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tailored for {CONTRIBUTION_TYPES.find((t) => t.id === selectedType)?.label}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Local Food Fields */}
              {selectedType === 'local-food' && (
                <>
                  <div>
                    <label htmlFor="foodType" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Food Category
                    </label>
                    <input
                      type="text"
                      id="foodType"
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleChange}
                      placeholder="e.g. Street Snack, Heritage Thali, Sweets"
                      className="input-terra w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="dietaryInfo" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Dietary Classification
                    </label>
                    <select
                      id="dietaryInfo"
                      name="dietaryInfo"
                      value={formData.dietaryInfo}
                      onChange={handleChange}
                      className="input-terra w-full bg-white"
                    >
                      <option value="Vegetarian">Pure Vegetarian</option>
                      <option value="Vegan">Vegan-Friendly</option>
                      <option value="Non-Vegetarian">Non-Vegetarian / Regional Meats</option>
                      <option value="Jain-Friendly">Jain-Friendly Options</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="typicalPrice" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Typical Price Range
                    </label>
                    <input
                      type="text"
                      id="typicalPrice"
                      name="typicalPrice"
                      value={formData.typicalPrice}
                      onChange={handleChange}
                      placeholder="e.g. ₹50 – ₹150 per plate"
                      className="input-terra w-full"
                    />
                  </div>
                </>
              )}

              {/* Folk & Culture Fields */}
              {selectedType === 'folk-culture' && (
                <>
                  <div>
                    <label htmlFor="traditionType" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Tradition / Performance Form
                    </label>
                    <input
                      type="text"
                      id="traditionType"
                      name="traditionType"
                      value={formData.traditionType}
                      onChange={handleChange}
                      placeholder="e.g. Bundeli Rai Dance, Devotional Kirtan"
                      className="input-terra w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="usualSeason" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Usual Season or Timing
                    </label>
                    <input
                      type="text"
                      id="usualSeason"
                      name="usualSeason"
                      value={formData.usualSeason}
                      onChange={handleChange}
                      placeholder="e.g. Post-harvest (Oct-Nov), Evening Aarti"
                      className="input-terra w-full"
                    />
                  </div>
                </>
              )}

              {/* Arts & Crafts Fields */}
              {selectedType === 'arts-crafts' && (
                <>
                  <div>
                    <label htmlFor="craftType" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Craft Medium
                    </label>
                    <input
                      type="text"
                      id="craftType"
                      name="craftType"
                      value={formData.craftType}
                      onChange={handleChange}
                      placeholder="e.g. Terracotta Votive, Bamboo Weaving, Bell Metal"
                      className="input-terra w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="workshopAvailability" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Workshop Availability
                    </label>
                    <select
                      id="workshopAvailability"
                      name="workshopAvailability"
                      value={formData.workshopAvailability}
                      onChange={handleChange}
                      className="input-terra w-full bg-white"
                    >
                      <option value="Available upon request">Available upon advance request</option>
                      <option value="Daily walk-in">Daily walk-ins welcome</option>
                      <option value="Exhibition only">Demonstration & gallery viewing only</option>
                    </select>
                  </div>
                </>
              )}

              {/* Nature & Adventure Fields */}
              {selectedType === 'nature-adventure' && (
                <>
                  <div>
                    <label htmlFor="activityType" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Activity Type
                    </label>
                    <input
                      type="text"
                      id="activityType"
                      name="activityType"
                      value={formData.activityType}
                      onChange={handleChange}
                      placeholder="e.g. River Walk, Kayaking, Birdwatching"
                      className="input-terra w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="estimatedDuration" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      id="estimatedDuration"
                      name="estimatedDuration"
                      value={formData.estimatedDuration}
                      onChange={handleChange}
                      placeholder="e.g. 1.5 – 2.5 hours"
                      className="input-terra w-full"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="accessibilityNotes" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Terrain & Accessibility Notes
                    </label>
                    <input
                      type="text"
                      id="accessibilityNotes"
                      name="accessibilityNotes"
                      value={formData.accessibilityNotes}
                      onChange={handleChange}
                      placeholder="e.g. Rocky granite surfaces, moderate slope, sturdy footwear needed"
                      className="input-terra w-full"
                    />
                  </div>
                </>
              )}

              {/* Village Experience Fields */}
              {selectedType === 'village-experience' && (
                <>
                  <div>
                    <label htmlFor="villageDuration" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Recommended Stay / Duration
                    </label>
                    <select
                      id="villageDuration"
                      name="villageDuration"
                      value={formData.villageDuration}
                      onChange={handleChange}
                      className="input-terra w-full bg-white"
                    >
                      <option value="Half Day (3-4 hrs)">Half Day (3–4 Hours)</option>
                      <option value="Full Day (6-8 hrs)">Full Day (6–8 Hours)</option>
                      <option value="Overnight Homestay">Overnight Homestay (1–2 Days)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="villageDescription" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Community Experience Highlights
                    </label>
                    <input
                      type="text"
                      id="villageDescription"
                      name="villageDescription"
                      value={formData.villageDescription}
                      onChange={handleChange}
                      placeholder="e.g. Milking indigenous cows, clay oven baking, organic field tour"
                      className="input-terra w-full"
                    />
                  </div>
                </>
              )}

              {/* Hidden Place Fields */}
              {selectedType === 'hidden-place' && (
                <>
                  <div>
                    <label htmlFor="bestVisitingTime" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Best Visiting Time
                    </label>
                    <input
                      type="text"
                      id="bestVisitingTime"
                      name="bestVisitingTime"
                      value={formData.bestVisitingTime}
                      onChange={handleChange}
                      placeholder="e.g. Early Sunrise (6:30 AM) or Winter Months"
                      className="input-terra w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="entryFee" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Entry Fee (if known)
                    </label>
                    <input
                      type="text"
                      id="entryFee"
                      name="entryFee"
                      value={formData.entryFee}
                      onChange={handleChange}
                      placeholder="e.g. Free entry / ₹50 camera fee"
                      className="input-terra w-full"
                    />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 4.E Community Information & Verification */}
          <section className="bg-card rounded-xl p-6 border border-border-subtle shadow-level-1 space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-border-subtle pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span>6. Community Contributor Verification</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="contributorName" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Contributor Display Name
                </label>
                <input
                  type="text"
                  id="contributorName"
                  name="contributorName"
                  value={formData.contributorName}
                  onChange={handleChange}
                  className="input-terra w-full"
                />
              </div>

              <div>
                <label htmlFor="localTips" className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Insider Etiquette or Responsible Visitor Tip <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="localTips"
                  name="localTips"
                  value={formData.localTips}
                  onChange={handleChange}
                  placeholder="e.g. Please ask before photographing local weavers, carry your own water bottle"
                  className="input-terra w-full"
                />
              </div>

              {/* Required confirmation checkbox */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="confirmAccurate"
                    checked={formData.confirmAccurate}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I confirm that the submitted information is accurate and gathered through respectful, firsthand community engagement. <span className="text-primary">*</span>
                  </span>
                </label>
                {errors.confirmAccurate && (
                  <p className="text-xs text-red-600 flex items-center gap-1 font-medium pl-7">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.confirmAccurate}</span>
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="photoRights"
                    checked={formData.photoRights}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                  />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    I acknowledge that any photos uploaded belong to me or are provided with community permission for responsible travel promotion.
                  </span>
                </label>
              </div>
            </div>
          </section>

          {/* 5. Form Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2 px-4 order-3 sm:order-1"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn-secondary text-xs sm:text-sm py-2.5 px-4 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
              >
                <Save className="w-4 h-4 text-slate-600" />
                <span>Save Draft</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-xs sm:text-sm py-2.5 px-6 flex items-center justify-center gap-2 flex-1 sm:flex-initial shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Contribution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
