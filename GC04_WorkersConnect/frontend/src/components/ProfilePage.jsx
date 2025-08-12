import React, { useEffect, useState } from "react";
import {
  Edit,
  Save,
  Camera,
  Loader2,
  Upload,
  Mail,
  Phone,
  MapPin,
  Cake,
  Briefcase,
} from "lucide-react";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    bio: "",
    profile_picture: null,
  });

  // Fetch user from localStorage on mount
  useEffect(() => {
    const fetchUserIdFromStorage = async () => {
      try {
        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        if (userFromStorage && userFromStorage.id) {
          setUserId(userFromStorage.id);
          await fetchUserData(userFromStorage.id);
        } else {
          setIsLoading(false);
          setError("User not found in local storage. Please log in again.");
        }
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setError("Error loading user data. Please log in again.");
        setIsLoading(false);
      }
    };
    fetchUserIdFromStorage();
  }, []);

  // Fetch user data from API
  const fetchUserData = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data && data.user) {
        // Map API response to our state structure
        setProfileData({
          name: data.user.name || "",
          age: data.user.age || "",
          email: data.user.email || "",
          phone: data.user.phone_number || "",
          address: data.user.address || "",
          serviceType: data.user.category_main || "",
          bio: data.user.bio || "",
          profile_picture:
            data.user.profile_picture || "https://picsum.photos/200",
        });
      } else {
        setError("User data not found");
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = async (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      setIsUploading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3000/api/uploadProfilePic/${userId}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Update profile picture in state
        setProfileData((prev) => ({
          ...prev,
          profile_picture: result.url,
        }));
      } else {
        setError(result.msg || "Failed to upload profile picture");
      }
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      setError("Failed to upload profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Save updated profile to backend
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Map our state structure to match the API's expected format
      const updatedData = {
        name: profileData.name,
        email: profileData.email,
        age: profileData.age,
        phone_number: profileData.phone,
        address: profileData.address,
        category_main: profileData.serviceType,
        bio: profileData.bio,
      };
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();

      if (response.ok) {
        setIsEditing(false);
      } else {
        setError(result.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="flex flex-col items-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <h2 className="mt-4 text-xl font-semibold">Loading profile...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="card bg-gray-800 shadow-xl">
          {/* Banner */}
          <div className="relative h-52 w-full rounded-t-2xl overflow-hidden bg-primary/10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40"></div>
            <img
              src={profileData.profile_picture}
              alt="cover"
              className="h-full w-full object-cover opacity-40"
            />
            {isEditing && (
              <label className="absolute bottom-4 right-4 btn btn-circle btn-sm bg-base-100">
                <Camera size={18} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                />
              </label>
            )}

            {/* Edit/Save Button - Moved to top right */}
            <div className="absolute top-4 right-4">
              <button
                className={`btn ${isEditing ? "btn-success" : "btn-primary"}`}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save size={16} />
                    Save
                  </>
                ) : (
                  <>
                    <Edit size={16} />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="card-body relative">
            {/* Avatar */}
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div className="avatar online">
                <div className="w-32 rounded-full ring ring-indigo-500 ring-offset-gray-900 ring-offset-2 shadow-lg">
                  <img src={profileData.profile_picture} alt="avatar" />
                </div>
              </div>
              {isEditing && (
                <label className="absolute bottom-1 right-1 btn btn-circle btn-xs btn-primary">
                  <Camera size={12} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                  />
                </label>
              )}
            </div>

            {/* Profile Info Section */}
            <div className="mt-16 text-center mb-6">
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <div className="badge badge-primary badge-outline mt-2">
                {profileData.serviceType}
              </div>

              {/* Dedicated Upload Button */}
              <div className="mt-4 flex justify-center">
                <label
                  className={`btn ${isUploading ? "btn-disabled" : "btn-primary"} gap-2`}
                >
                  {isUploading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Upload size={16} />
                  )}
                  {isUploading ? "Uploading..." : "Change Profile Photo"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card bg-base-200 shadow-sm mb-6">
              <div className="card-body">
                <h2 className="card-title text-primary mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                      />
                    </svg>
                    Contact Information
                  </div>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" size={20} />
                    <div>
                      <div className="text-xs opacity-70">Email</div>
                      <div>{profileData.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" size={20} />
                    <div>
                      <div className="text-xs opacity-70">Phone</div>
                      <div>{profileData.phone || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary" size={20} />
                    <div>
                      <div className="text-xs opacity-70">Address</div>
                      <div>{profileData.address || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cake className="text-primary" size={20} />
                    <div>
                      <div className="text-xs opacity-70">Age</div>
                      <div>{profileData.age || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Briefcase className="text-primary" size={20} />
                    <div>
                      <div className="text-xs opacity-70">Service Type</div>
                      <div>{profileData.serviceType || "Not provided"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="card bg-base-200 shadow-sm mb-6">
              <div className="card-body">
                <h2 className="card-title text-primary mb-4">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    Biography
                  </div>
                </h2>
                <div className="prose max-w-none">
                  <p>{profileData.bio || "No biography provided."}</p>
                </div>
              </div>
            </div>

            {/* Editable Fields - Only visible in edit mode */}
            {isEditing && <div className="divider">Edit Your Information</div>}

            {isEditing && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Name",
                      name: "name",
                      type: "text",
                      required: true,
                      icon: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                          />
                        </svg>
                      ),
                    },
                    {
                      label: "Service Type",
                      name: "serviceType",
                      type: "text",
                      icon: <Briefcase size={18} />,
                    },
                    {
                      label: "Email",
                      name: "email",
                      type: "email",
                      required: true,
                      icon: <Mail size={18} />,
                    },
                    {
                      label: "Phone",
                      name: "phone",
                      type: "tel",
                      icon: <Phone size={18} />,
                    },
                    {
                      label: "Age",
                      name: "age",
                      type: "number",
                      icon: <Cake size={18} />,
                    },
                    {
                      label: "Address",
                      name: "address",
                      type: "text",
                      icon: <MapPin size={18} />,
                    },
                  ].map(({ label, name, type, required, icon }) => (
                    <div key={name} className="form-control w-full">
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          {icon}
                          {label}{" "}
                          {required && <span className="text-error">*</span>}
                        </span>
                      </label>
                      <input
                        type={type}
                        name={name}
                        className="input input-bordered w-full border border-blue-800 rounded-md"
                        value={profileData[name]}
                        onChange={handleChange}
                        required={required}
                      />
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>
                      Bio
                    </span>
                  </label>
                  <textarea
                    name="bio"
                    className="textarea textarea-bordered h-24"
                    value={profileData.bio}
                    onChange={handleChange}
                    rows={4}
                  ></textarea>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
