import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const navigate = useNavigate();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = () => {
    const allSlots = [];
    const now = new Date();

    // If current time is past 9 PM, skip today and start from tomorrow
    const startOffset = now.getHours() >= 21 ? 1 : 0;

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() + i + startOffset);

      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayStart.setHours(10, 0, 0, 0);
      dayEnd.setHours(21, 0, 0, 0);

      // If it's the first available day (today) and not after 9 PM, start from current time + 1 hour
      if (i === 0 && startOffset === 0) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        if (currentHour < 10) {
          dayStart.setHours(10, 0, 0, 0);
        } else {
          const roundedMinutes = currentMinute > 30 ? 0 : 30;
          dayStart.setHours(
            currentHour + (roundedMinutes === 0 ? 1 : 0),
            roundedMinutes,
            0,
            0
          );
        }
      }

      const timeSlots = [];
      const slotTime = new Date(dayStart);

      while (slotTime < dayEnd) {
        const day = slotTime.getDate();
        const month = slotTime.getMonth() + 1;
        const year = slotTime.getFullYear();
        const slotDate = `${day}-${month}-${year}`;

        const timeString = slotTime
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .toUpperCase();

        const isSlotBooked =
          docInfo?.slots_booked?.[slotDate]?.includes(timeString) ?? false;

        if (!isSlotBooked) {
          timeSlots.push({
            datetime: new Date(slotTime),
            time: timeString,
          });
        }
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    setLoading(true);
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "-" + month + "-" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      console.log(data);
      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt="doctor_image"
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img
                className="w-5"
                src={assets.verified_icon}
                alt="verified_icon"
              />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              {docInfo.degree} - {docInfo.speciality}
              <button className="py-0.5 px-2 border text-sm rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="info_icon" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-y-scroll mt-4">
            {doctors.length &&
              docSlots.map((item, index) => (
                <div
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  onClick={() => setSlotIndex(index)}
                >
                  <p>{item[0] && daysOfWeek[item[0]?.datetime?.getDay()]}</p>
                  <p>{item[0]?.datetime?.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => {
                    setSlotTime(item.time);
                  }}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            disabled={loading}
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            Book an appointment
            {loading && (
              <span className="h-4 w-4 rounded-b-full border-2 border-white border-t-transparent animation-spin"></span>
            )}
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
