require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");
const Company = require("../models/Company");
const Service = require("../models/Service");
const Product = require("../models/Product");
const Portfolio = require("../models/Portfolio");
const Testimonial = require("../models/Testimonial");
const Career = require("../models/Career");
const CareerApplication = require("../models/CareerApplication");

(async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Company.deleteMany(),
    Service.deleteMany(),
    Product.deleteMany(),
    Portfolio.deleteMany(),
    Testimonial.deleteMany(),
    Career.deleteMany(),
    CareerApplication.deleteMany()
  ]);

  const company = await Company.create({
    name: "Fernando TechAll",
    domain: "fernandotechall.com",
    owner: null
  });

  const users = await User.create([
    { name: "Admin", email: "admin@fernandotechall.com", password: "Admin@123", role: "admin", company: company._id },
    { name: "HR Manager", email: "hr@fernandotechall.com", password: "Hr@12345", role: "hr_manager", company: company._id },
    { name: "Care Manager", email: "manager@fernandotechall.com", password: "Manager@123", role: "customer_care_manager", company: company._id },
    { name: "Care Agent", email: "care@fernandotechall.com", password: "Care@123", role: "customer_care_agent", company: company._id },
    { name: "IT Support", email: "support@fernandotechall.com", password: "Support@123", role: "it_support_agent", company: company._id },
    { name: "Demo User", email: "user@example.com", password: "User@123", role: "user", company: company._id }
  ]);

  company.owner = users[0]._id; // Admin
  await company.save();

  await Service.create([
    { title: "Web Development", description: "Modern responsive web applications", icon: "code", price: "From $499" },
    { title: "Mobile Development", description: "iOS & Android apps", icon: "smartphone", price: "From $999" },
    { title: "UI/UX Design", description: "Beautiful intuitive experiences", icon: "palette", price: "From $299" },
    { title: "IT Support", description: "24/7 IT support for your business", icon: "headphones", price: "From $99/mo" },
    { title: "Cloud Solutions", description: "Scalable cloud infrastructure", icon: "cloud", price: "Custom" },
    { title: "Custom Software", description: "Tailored software for your needs", icon: "cpu", price: "Custom" }
  ]);

  await Product.create([
    { name: "TechAll CRM", description: "All-in-one CRM platform", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", price: 199 },
    { name: "TechAll POS", description: "Point of sale for retail", image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800", price: 149 },
    { name: "TechAll Cloud Suite", description: "Productivity cloud apps", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", price: 99 }
  ]);

  await Portfolio.create([
    { title: "E-Commerce Platform", description: "Full stack e-commerce solution", image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800", featured: true },
    { title: "Task Management App", description: "Productivity & task tracking", image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800", featured: true },
    { title: "Fintech Dashboard", description: "Financial analytics dashboard", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", featured: true },
    { title: "Hotel Booking App", description: "Online hotel reservation system", image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101b?w=800" },
    { title: "Learning Management System", description: "Online courses & education", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800" },
    { title: "Health & Fitness App", description: "Fitness tracking application", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800" }
  ]);

  await Testimonial.create([
    { name: "John Doe", company: "Acme Corp", message: "Outstanding service and brilliant team!", avatar: "https://i.pravatar.cc/100?img=12", rating: 5 },
    { name: "Sarah Smith", company: "Beta Ltd", message: "Delivered on time and exceeded expectations.", avatar: "https://i.pravatar.cc/100?img=32", rating: 5 },
    { name: "Michael Lee", company: "Gamma Inc", message: "Their IT support is top-notch.", avatar: "https://i.pravatar.cc/100?img=8", rating: 5 }
  ]);

  await Career.create([
    {
      title: "Senior Frontend Engineer",
      slug: "senior-frontend-engineer",
      department: "Engineering",
      location: "Colombo / Remote",
      type: "full_time",
      experience: "5+ years",
      salary: "$2,000 - $3,500 / month",
      summary: "Lead high-end product interfaces for customer dashboards and public brand experiences.",
      description: "Work with design, product and backend teams to ship premium web experiences across the Fernando TechAll platform.",
      responsibilities: ["Own frontend architecture", "Ship polished UI systems", "Collaborate with product and backend"],
      requirements: ["React expertise", "Strong UI craft", "API integration experience"],
      isActive: true
    },
    {
      title: "HR Operations Specialist",
      slug: "hr-operations-specialist",
      department: "Human Resources",
      location: "Negombo",
      type: "full_time",
      experience: "3+ years",
      salary: "Negotiable",
      summary: "Manage hiring operations, candidate experience and culture programs.",
      description: "Coordinate hiring pipelines, interviews, onboarding and employer branding as Fernando TechAll grows.",
      responsibilities: ["Manage applications", "Coordinate interviews", "Improve candidate experience"],
      requirements: ["HR operations background", "Strong communication", "Hiring coordination skills"],
      isActive: true
    }
  ]);

  console.log("Seed complete.");
  process.exit(0);
})();
