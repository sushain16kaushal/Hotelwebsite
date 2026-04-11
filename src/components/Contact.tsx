
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Please tell us a bit more (min 10 chars)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    console.log(data);
    toast.success("Message sent! Our concierge will reach out soon.");
    reset();
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[5px] text-amber-700 font-bold">Get In Touch</span>
          <h1 className="text-5xl font-serif font-bold text-[#4a3f35] mt-4">Contact Our Concierge</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* --- LEFT: Contact Form --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-stone-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Full Name</label>
                <input 
                  {...register("name")}
                  className="w-full mt-2 p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-amber-200 transition-all"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold uppercase">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">Email Address</label>
                <input 
                  {...register("email")}
                  className="w-full mt-2 p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-amber-200 transition-all"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold uppercase">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-2">How can we help?</label>
                <textarea 
                  {...register("message")}
                  rows={4}
                  className="w-full mt-2 p-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-amber-200 transition-all resize-none"
                  placeholder="Describe your requirements..."
                />
                {errors.message && <p className="text-red-400 text-[10px] mt-1 ml-2 font-bold uppercase">{errors.message.message}</p>}
              </div>

              <button className="w-full py-4 bg-stone-900 text-[#f5efe6] rounded-2xl font-bold uppercase tracking-widest hover:bg-amber-900 transition-all active:scale-95 shadow-lg">
                Send Inquiry
              </button>
            </form>
          </motion.div>

          {/* --- RIGHT: Direct Contact & Map --- */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="mailto:concierge@euphoriahotels.com" className="group p-6 bg-amber-50 rounded-[2rem] border border-amber-100 transition-all hover:bg-amber-100">
                <p className="text-[10px] uppercase font-bold text-amber-800 mb-2 tracking-widest">Email Us</p>
                <p className="text-sm font-bold text-[#4a3f35] break-all group-hover:underline">stay@euphoriahotels.com</p>
              </a>

              <a href="tel:+919876543210" className="group p-6 bg-stone-900 rounded-[2rem] transition-all hover:bg-stone-800">
                <p className="text-[10px] uppercase font-bold text-amber-200 mb-2 tracking-widest">Call Concierge</p>
                <p className="text-sm font-bold text-white group-hover:underline">+91 98765 43210</p>
              </a>
            </div>

            {/* Google Map Frame */}
            <div className="rounded-[3rem] overflow-hidden border border-stone-200 shadow-inner h-[350px] relative">
              <iframe 
                title="Euphoria Hotels Location"
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src="https://maps.google.com/maps?q=Summer%20Hill,%20Shimla%20Himachal%20Pradesh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="grayscale-[0.3] contrast-[1.1]"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-stone-100 shadow-md">
                <p className="text-[9px] uppercase font-extrabold text-amber-800 tracking-widest mb-1">Main Branch</p>
                <p className="text-[11px] text-[#4a3f35] font-medium leading-tight">
                  Sunset View Point Road, Summer Hill, Shimla – 171005, India
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;