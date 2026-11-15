export default function SocialImage() {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#f5f2e9",
        color: "#20362e",
        display: "flex",
        height: "100%",
        padding: "72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#e6b07f",
          borderRadius: "50%",
          height: "450px",
          position: "absolute",
          right: "-55px",
          top: "90px",
          width: "450px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "16px" }}>
          <div
            style={{
              alignItems: "center",
              background: "#244b3b",
              borderRadius: "12px",
              color: "#fcfbf7",
              display: "flex",
              fontSize: "30px",
              fontWeight: 700,
              height: "54px",
              justifyContent: "center",
              width: "54px",
            }}
          >
            C
          </div>
          <div style={{ display: "flex", fontSize: "34px", fontWeight: 700 }}>
            cart<span style={{ color: "#829975" }}>scout</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "820px" }}>
          <div style={{ fontFamily: "Georgia", fontSize: "68px", lineHeight: 1.05 }}>
            Find a cart for your next route.
          </div>
          <div style={{ color: "#52675a", fontSize: "28px" }}>
            Golf cart listings and rental enquiries
          </div>
        </div>
        <div style={{ color: "#52675a", fontSize: "20px" }}>
          Call or WhatsApp +27 83 943 5908
        </div>
      </div>
    </div>
  );
}
