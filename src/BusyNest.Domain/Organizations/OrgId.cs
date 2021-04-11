using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BusyNest.Domain.Organizations
{
    [JsonConverter(typeof(OrgIdJsonConverter))]
    public class OrgId
    {
        private readonly Guid id;

        private OrgId(Guid id) => this.id = id;

        public static OrgId NewId() => new OrgId(Guid.NewGuid());

        public static bool TryParse(string candidate, out OrgId orgId)
        {
            orgId = null;
            if (Guid.TryParse(candidate, out var guid))
            {
                orgId = new OrgId(guid);
                return true;
            }
            return false;
        }

        public override string ToString() => id.ToString();

        public override int GetHashCode() => id.GetHashCode();

        public class OrgIdJsonConverter : JsonConverter<OrgId>
        {
            public override OrgId Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                if (OrgId.TryParse(reader.GetString(), out var id))
                {
                    return id;
                }
                throw new JsonException();
            }

            public override void Write(Utf8JsonWriter writer, OrgId value, JsonSerializerOptions options)
                => writer.WriteStringValue(value.ToString());
        }
    }
}
