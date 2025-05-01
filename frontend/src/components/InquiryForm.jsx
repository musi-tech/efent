import React, { Component } from "react";

const categories = [
  "Wedding Venues", "Caterers", "Wedding Invitations", "Wedding Gifts",
  "Wedding Photographers", "Wedding Music", "Wedding Transportation", "Tent House",
  "Wedding Entertainment", "Florists", "Wedding Planners", "Wedding Videography",
  "Honeymoon", "Wedding Decorators", "Wedding Cakes", "Wedding DJ", "Pandits",
  "Photobooth", "Astrologers", "Party Places", "Wedding Choreographers",
  "Bridal Jewellery", "Bridal Makeup Artists", "Bridal Lehenga", "Mehndi Artists",
  "Makeup Salon", "Trousseau Packing", "Grooms", "Sherwani"
];

class InquiryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: "",
        contactNumber: "",
        location: "",
        categories: [], // Changed from single category to array of categories
        requirement: ""
      },
      showCategoryDropdown: false,
      formSubmitted: false,
      submitMessage: "",
      isLoading: false
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }));
  };

  toggleCategory = (category) => {
    this.setState(prevState => {
      const currentCategories = [...prevState.formData.categories];
      
      if (currentCategories.includes(category)) {
        // Remove if already selected
        return {
          formData: {
            ...prevState.formData,
            categories: currentCategories.filter(cat => cat !== category)
          }
        };
      } else {
        // Add if not already selected
        return {
          formData: {
            ...prevState.formData,
            categories: [...currentCategories, category]
          }
        };
      }
    });
  };

  toggleCategoryDropdown = () => {
    this.setState(prevState => ({
      showCategoryDropdown: !prevState.showCategoryDropdown
    }));
  };

  handleSubmitRequirement = async () => {
    const { name, contactNumber, location, categories, requirement } = this.state.formData;

    if (!name || !contactNumber || !location || categories.length === 0 || !requirement) {
      alert("Please fill in all fields and select at least one category!");
      return;
    }

    this.setState({ isLoading: true });

    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state.formData)
      });

      const result = await response.json();

      if (response.ok) {
        this.setState({
          formSubmitted: true,
          submitMessage: `Thank you, ${name}! We have received your inquiry.`,
          isLoading: false
        });

        setTimeout(() => {
          this.setState({
            formData: {
              name: "",
              contactNumber: "",
              location: "",
              categories: [],
              requirement: ""
            },
            formSubmitted: false,
            submitMessage: ""
          });
          if (this.props.onClose) this.props.onClose();
        }, 3000);
      } else {
        alert("Submission failed. Please try again.");
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { formData, formSubmitted, submitMessage, isLoading, showCategoryDropdown } = this.state;
    const { onClose } = this.props;

    return (
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Form Container */}
        <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl z-50 animate-fade-in-up transition-all duration-300">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-700 hover:text-red-500 hover:rotate-90 transition-transform duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-2xl md:text-3xl font-bold text-center text-pink-600 mb-8">
            ✨ Tell Us What You Need ✨
          </h3>

          {formSubmitted ? (
            <div className="bg-green-500/90 text-white p-6 rounded-2xl text-center shadow-lg">
              <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-semibold text-lg">Submission Successful!</p>
              <p className="text-sm mt-2">{submitMessage}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <input
                type="text"
                name="name"
                placeholder="Your Full Name"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={formData.name}
                onChange={this.handleChange}
              />
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={formData.contactNumber}
                onChange={this.handleChange}
              />
              
              {/* Multi-select category dropdown */}
              <div className="relative">
                <button 
                  type="button"
                  onClick={this.toggleCategoryDropdown}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none text-left flex justify-between items-center"
                >
                  <span>
                    {formData.categories.length === 0 
                      ? "Select Vendor Categories" 
                      : `${formData.categories.length} ${formData.categories.length === 1 ? 'category' : 'categories'} selected`}
                  </span>
                  <svg className={`w-5 h-5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showCategoryDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                    <div className="p-2">
                      {categories.map((category, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center px-3 py-2 hover:bg-pink-50 rounded-lg cursor-pointer"
                          onClick={() => this.toggleCategory(category)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.categories.includes(category)}
                            onChange={() => {}}
                            className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                          />
                          <span>{category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Selected categories chips/badges */}
              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.categories.map((cat, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                    >
                      {cat}
                      <button
                        type="button"
                        onClick={() => this.toggleCategory(cat)}
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-pink-200 text-pink-800 hover:bg-pink-300"
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <input
                type="text"
                name="location"
                placeholder="Your City / Location"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none"
                value={formData.location}
                onChange={this.handleChange}
              />
              <textarea
                name="requirement"
                placeholder="Describe Your Requirement..."
                className="w-full px-4 py-3 h-28 rounded-xl bg-white border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none"
                value={formData.requirement}
                onChange={this.handleChange}
              />
              <button
                onClick={this.handleSubmitRequirement}
                className={`w-full text-white py-3 rounded-xl font-semibold transition duration-300 shadow-lg ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Requirement"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default InquiryForm;