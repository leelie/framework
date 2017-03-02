package com.hn658.framework.logging.logSender.socket;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class ZeroConfSupport {
	
	public static final Log LOGGER = LogFactory.getLog(ZeroConfSupport.class);
	
	private static Object jmDNS = initializeJMDNS();

    Object serviceInfo;
    private static Class jmDNSClass;
    private static Class serviceInfoClass;

    public ZeroConfSupport(String zone, int port, String name, Map properties) {
        //if version 3 is available, use it to constuct a serviceInfo instance, otherwise support the version1 API
        boolean isVersion3 = false;
        try {
            //create method is in version 3, not version 1
            jmDNSClass.getMethod("create", null);
            isVersion3 = true;
        } catch (NoSuchMethodException e) {
            //no-op
        }

        if (isVersion3) {
        	LOGGER.debug("using JmDNS version 3 to construct serviceInfo instance");
            serviceInfo = buildServiceInfoVersion3(zone, port, name, properties);
        } else {
            LOGGER.debug("using JmDNS version 1.0 to construct serviceInfo instance");
            serviceInfo = buildServiceInfoVersion1(zone, port, name, properties);
        }
    }

    public ZeroConfSupport(String zone, int port, String name) {
        this(zone, port, name, new HashMap());
    }

    private static Object createJmDNSVersion1()
    {
        try {
            return jmDNSClass.newInstance();
        } catch (InstantiationException e) {
            LOGGER.warn("Unable to instantiate JMDNS", e);
        } catch (IllegalAccessException e) {
            LOGGER.warn("Unable to instantiate JMDNS", e);
        }
        return null;
    }

    private static Object createJmDNSVersion3()
    {
        try {
            Method jmDNSCreateMethod = jmDNSClass.getMethod("create", null);
            return jmDNSCreateMethod.invoke(null, null);
        } catch (IllegalAccessException e) {
            LOGGER.warn("Unable to instantiate jmdns class", e);
        } catch (NoSuchMethodException e) {
            LOGGER.warn("Unable to access constructor", e);
        } catch (InvocationTargetException e) {
                LOGGER.warn("Unable to call constructor", e);
        }
        return null;
    }

    private Object buildServiceInfoVersion1(String zone, int port, String name, Map properties) {
        //version 1 uses a hashtable
        Hashtable hashtableProperties = new Hashtable(properties);
        try {
            Class[] args = new Class[6];
            args[0] = String.class;
            args[1] = String.class;
            args[2] = int.class;
            args[3] = int.class; //weight (0)
            args[4] = int.class; //priority (0)
            args[5] = Hashtable.class;
            Constructor constructor  = serviceInfoClass.getConstructor(args);
            Object[] values = new Object[6];
            values[0] = zone;
            values[1] = name;
            values[2] = new Integer(port);
            values[3] = new Integer(0);
            values[4] = new Integer(0);
            values[5] = hashtableProperties;
            Object result = constructor.newInstance(values);
            LOGGER.debug("created serviceinfo: " + result);
            return result;
        } catch (IllegalAccessException e) {
            LOGGER.warn("Unable to construct ServiceInfo instance", e);
        } catch (NoSuchMethodException e) {
            LOGGER.warn("Unable to get ServiceInfo constructor", e);
        } catch (InstantiationException e) {
            LOGGER.warn("Unable to construct ServiceInfo instance", e);
        } catch (InvocationTargetException e) {
            LOGGER.warn("Unable to construct ServiceInfo instance", e);
        }
        return null;
    }

    private Object buildServiceInfoVersion3(String zone, int port, String name, Map properties) {
        try {
            Class[] args = new Class[6];
            args[0] = String.class; //zone/type
            args[1] = String.class; //display name
            args[2] = int.class; //port
            args[3] = int.class; //weight (0)
            args[4] = int.class; //priority (0)
            args[5] = Map.class;
            Method serviceInfoCreateMethod = serviceInfoClass.getMethod("create", args);
            Object[] values = new Object[6];
            values[0] = zone;
            values[1] = name;
            values[2] = new Integer(port);
            values[3] = new Integer(0);
            values[4] = new Integer(0);
            values[5] = properties;
            Object result = serviceInfoCreateMethod.invoke(null, values);
            LOGGER.debug("created serviceinfo: " + result);
            return result;
        } catch (IllegalAccessException e) {
            LOGGER.warn("Unable to invoke create method", e);
        } catch (NoSuchMethodException e) {
            LOGGER.warn("Unable to find create method", e);
        } catch (InvocationTargetException e) {
                LOGGER.warn("Unable to invoke create method", e);
        }
        return null;
    }

    public void advertise() {
        try {
            Method method = jmDNSClass.getMethod("registerService", new Class[]{serviceInfoClass});
            method.invoke(jmDNS, new Object[]{serviceInfo});
            LOGGER.debug("registered serviceInfo: " + serviceInfo);
        } catch(IllegalAccessException e) {
            LOGGER.warn("Unable to invoke registerService method", e);
        } catch(NoSuchMethodException e) {
            LOGGER.warn("No registerService method", e);
        } catch(InvocationTargetException e) {
            LOGGER.warn("Unable to invoke registerService method", e);
        }
    }

    public void unadvertise() {
        try {
            Method method = jmDNSClass.getMethod("unregisterService", new Class[]{serviceInfoClass});
            method.invoke(jmDNS, new Object[]{serviceInfo});
            LOGGER.debug("unregistered serviceInfo: " + serviceInfo);
        } catch(IllegalAccessException e) {
            LOGGER.warn("Unable to invoke unregisterService method", e);
        } catch(NoSuchMethodException e) {
            LOGGER.warn("No unregisterService method", e);
        } catch(InvocationTargetException e) {
            LOGGER.warn("Unable to invoke unregisterService method", e);
       }
    }

    private static Object initializeJMDNS() {
        try {
            jmDNSClass = Class.forName("javax.jmdns.JmDNS");
            serviceInfoClass = Class.forName("javax.jmdns.ServiceInfo");
        } catch (ClassNotFoundException e) {
            LOGGER.warn("JmDNS or serviceInfo class not found", e);
        }

        //if version 3 is available, use it to constuct a serviceInfo instance, otherwise support the version1 API
        boolean isVersion3 = false;
        try {
            //create method is in version 3, not version 1
            jmDNSClass.getMethod("create", null);
            isVersion3 = true;
        } catch (NoSuchMethodException e) {
            //no-op
        }

        if (isVersion3) {
            return createJmDNSVersion3();
        } else {
            return createJmDNSVersion1();
        }
    }

    public static Object getJMDNSInstance() {
        return jmDNS;
    }
}
